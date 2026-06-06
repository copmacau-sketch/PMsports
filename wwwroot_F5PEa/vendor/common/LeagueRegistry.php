<?php
/**
 * LeagueRegistry — single read-through cached front for db_sports.foot_league.
 *
 * Background: before this class, the legacy 9-league hard-coded $LEAGUES
 * map in `bdata/ingest_odds_api.php`, the `lidToSlug/slugToLid` pair and
 * `LID_MIN/MAX` constants in `member/api_v2.php`, and the same pair in
 * `crown-explorer/backend/app/mysqldb.py` were all manually-maintained
 * mirrors of the same 9 leagues.  Adding a single league required edits
 * in five places; covering Odds-API.io's full ~413-league football
 * catalog without a registry was therefore a non-starter.
 *
 * Now: the registry table `db_sports.foot_league` is the single source
 * of truth.  Every PHP entry point (api_v2.php, ingest_odds_api.php,
 * settle_bets.php) goes through this class for slug ↔ lid resolution.
 *
 * Cache layers:
 *   * Per-process static  — ~µs lookups on hot path inside one PHP run.
 *   * APCu (when present) — ~5-min TTL, shared across php-fpm workers.
 *   * MySQL fallback      — always authoritative on cache miss.
 *
 * `resolveOrCreate()` is the auto-registration entry point: when the
 * ingest cron sees a slug it has never persisted, it INSERTs a fresh
 * row with derived region/country/flag and an AUTO_INCREMENT lid (>=
 * 200, leaving 100..199 free for the pinned legacy lids).
 */
final class LeagueRegistry
{
    /** Cache TTL in seconds. */
    private const TTL = 300;

    /** APCu key prefix (versioned so a deploy can invalidate). */
    private const APCU_PREFIX = 'cg_lreg_v1_';

    /** Per-process memo: ['slug' => row, ...]. */
    private static array $memo = [];

    /** Per-process memo for the catalog tree (region → countries → leagues). */
    private static ?array $catalogMemo = null;
    private static int $catalogMemoTs = 0;

    /** Region id → display metadata. */
    private const REGION_META = [
        'europe'        => ['name_cn' => '欧洲',   'name_en' => 'Europe',        'flag' => '🇪🇺'],
        'asia'          => ['name_cn' => '亚洲',   'name_en' => 'Asia',          'flag' => '🌏'],
        'americas'      => ['name_cn' => '美洲',   'name_en' => 'Americas',      'flag' => '🌎'],
        'africa'        => ['name_cn' => '非洲',   'name_en' => 'Africa',        'flag' => '🌍'],
        'oceania'       => ['name_cn' => '大洋洲', 'name_en' => 'Oceania',       'flag' => '🌏'],
        'international' => ['name_cn' => '国际',   'name_en' => 'International', 'flag' => '🌐'],
        'other'         => ['name_cn' => '其他',   'name_en' => 'Other',         'flag' => '🏳️'],
    ];

    /** Country slug → [name_cn, name_en, flag, region].
     *  Slug values match the leading token of an Odds-API.io league
     *  slug.  ~120 entries cover ≥99% of upstream's active catalogue.
     *  Anything missing falls through to a slug-capitalised display
     *  with no flag, which the user can fix by editing the registry
     *  row directly. */
    private const COUNTRY_META = [
        // ── Europe ────────────────────────────────────────────────
        'england'        => ['name_cn' => '英格兰',     'name_en' => 'England',        'flag' => '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'region' => 'europe'],
        'scotland'       => ['name_cn' => '苏格兰',     'name_en' => 'Scotland',       'flag' => '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'region' => 'europe'],
        'wales'          => ['name_cn' => '威尔士',     'name_en' => 'Wales',          'flag' => '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'region' => 'europe'],
        'northern'       => ['name_cn' => '北爱尔兰',   'name_en' => 'Northern Irl.',  'flag' => '🇬🇧', 'region' => 'europe'],
        'ireland'        => ['name_cn' => '爱尔兰',     'name_en' => 'Ireland',        'flag' => '🇮🇪', 'region' => 'europe'],
        'italy'          => ['name_cn' => '意大利',     'name_en' => 'Italy',          'flag' => '🇮🇹', 'region' => 'europe'],
        'spain'          => ['name_cn' => '西班牙',     'name_en' => 'Spain',          'flag' => '🇪🇸', 'region' => 'europe'],
        'germany'        => ['name_cn' => '德国',       'name_en' => 'Germany',        'flag' => '🇩🇪', 'region' => 'europe'],
        'france'         => ['name_cn' => '法国',       'name_en' => 'France',         'flag' => '🇫🇷', 'region' => 'europe'],
        'portugal'       => ['name_cn' => '葡萄牙',     'name_en' => 'Portugal',       'flag' => '🇵🇹', 'region' => 'europe'],
        'netherlands'    => ['name_cn' => '荷兰',       'name_en' => 'Netherlands',    'flag' => '🇳🇱', 'region' => 'europe'],
        'belgium'        => ['name_cn' => '比利时',     'name_en' => 'Belgium',        'flag' => '🇧🇪', 'region' => 'europe'],
        'austria'        => ['name_cn' => '奥地利',     'name_en' => 'Austria',        'flag' => '🇦🇹', 'region' => 'europe'],
        'switzerland'    => ['name_cn' => '瑞士',       'name_en' => 'Switzerland',    'flag' => '🇨🇭', 'region' => 'europe'],
        'denmark'        => ['name_cn' => '丹麦',       'name_en' => 'Denmark',        'flag' => '🇩🇰', 'region' => 'europe'],
        'sweden'         => ['name_cn' => '瑞典',       'name_en' => 'Sweden',         'flag' => '🇸🇪', 'region' => 'europe'],
        'norway'         => ['name_cn' => '挪威',       'name_en' => 'Norway',         'flag' => '🇳🇴', 'region' => 'europe'],
        'finland'        => ['name_cn' => '芬兰',       'name_en' => 'Finland',        'flag' => '🇫🇮', 'region' => 'europe'],
        'iceland'        => ['name_cn' => '冰岛',       'name_en' => 'Iceland',        'flag' => '🇮🇸', 'region' => 'europe'],
        'poland'         => ['name_cn' => '波兰',       'name_en' => 'Poland',         'flag' => '🇵🇱', 'region' => 'europe'],
        'czechia'        => ['name_cn' => '捷克',       'name_en' => 'Czech Republic', 'flag' => '🇨🇿', 'region' => 'europe'],
        'slovakia'       => ['name_cn' => '斯洛伐克',   'name_en' => 'Slovakia',       'flag' => '🇸🇰', 'region' => 'europe'],
        'hungary'        => ['name_cn' => '匈牙利',     'name_en' => 'Hungary',        'flag' => '🇭🇺', 'region' => 'europe'],
        'romania'        => ['name_cn' => '罗马尼亚',   'name_en' => 'Romania',        'flag' => '🇷🇴', 'region' => 'europe'],
        'bulgaria'       => ['name_cn' => '保加利亚',   'name_en' => 'Bulgaria',       'flag' => '🇧🇬', 'region' => 'europe'],
        'greece'         => ['name_cn' => '希腊',       'name_en' => 'Greece',         'flag' => '🇬🇷', 'region' => 'europe'],
        'turkey'         => ['name_cn' => '土耳其',     'name_en' => 'Turkey',         'flag' => '🇹🇷', 'region' => 'europe'],
        'russia'         => ['name_cn' => '俄罗斯',     'name_en' => 'Russia',         'flag' => '🇷🇺', 'region' => 'europe'],
        'ukraine'        => ['name_cn' => '乌克兰',     'name_en' => 'Ukraine',        'flag' => '🇺🇦', 'region' => 'europe'],
        'belarus'        => ['name_cn' => '白俄罗斯',   'name_en' => 'Belarus',        'flag' => '🇧🇾', 'region' => 'europe'],
        'serbia'         => ['name_cn' => '塞尔维亚',   'name_en' => 'Serbia',         'flag' => '🇷🇸', 'region' => 'europe'],
        'croatia'        => ['name_cn' => '克罗地亚',   'name_en' => 'Croatia',        'flag' => '🇭🇷', 'region' => 'europe'],
        'slovenia'       => ['name_cn' => '斯洛文尼亚', 'name_en' => 'Slovenia',       'flag' => '🇸🇮', 'region' => 'europe'],
        'bosnia'         => ['name_cn' => '波黑',       'name_en' => 'Bosnia',         'flag' => '🇧🇦', 'region' => 'europe'],
        'montenegro'     => ['name_cn' => '黑山',       'name_en' => 'Montenegro',     'flag' => '🇲🇪', 'region' => 'europe'],
        'albania'        => ['name_cn' => '阿尔巴尼亚', 'name_en' => 'Albania',        'flag' => '🇦🇱', 'region' => 'europe'],
        'macedonia'      => ['name_cn' => '北马其顿',   'name_en' => 'North Macedonia','flag' => '🇲🇰', 'region' => 'europe'],
        'kosovo'         => ['name_cn' => '科索沃',     'name_en' => 'Kosovo',         'flag' => '🇽🇰', 'region' => 'europe'],
        'estonia'        => ['name_cn' => '爱沙尼亚',   'name_en' => 'Estonia',        'flag' => '🇪🇪', 'region' => 'europe'],
        'latvia'         => ['name_cn' => '拉脱维亚',   'name_en' => 'Latvia',         'flag' => '🇱🇻', 'region' => 'europe'],
        'lithuania'      => ['name_cn' => '立陶宛',     'name_en' => 'Lithuania',      'flag' => '🇱🇹', 'region' => 'europe'],
        'cyprus'         => ['name_cn' => '塞浦路斯',   'name_en' => 'Cyprus',         'flag' => '🇨🇾', 'region' => 'europe'],
        'malta'          => ['name_cn' => '马耳他',     'name_en' => 'Malta',          'flag' => '🇲🇹', 'region' => 'europe'],
        'luxembourg'     => ['name_cn' => '卢森堡',     'name_en' => 'Luxembourg',     'flag' => '🇱🇺', 'region' => 'europe'],
        'andorra'        => ['name_cn' => '安道尔',     'name_en' => 'Andorra',        'flag' => '🇦🇩', 'region' => 'europe'],
        'gibraltar'      => ['name_cn' => '直布罗陀',   'name_en' => 'Gibraltar',      'flag' => '🇬🇮', 'region' => 'europe'],
        'faroe'          => ['name_cn' => '法罗群岛',   'name_en' => 'Faroe Islands',  'flag' => '🇫🇴', 'region' => 'europe'],
        'moldova'        => ['name_cn' => '摩尔多瓦',   'name_en' => 'Moldova',        'flag' => '🇲🇩', 'region' => 'europe'],
        'georgia'        => ['name_cn' => '格鲁吉亚',   'name_en' => 'Georgia',        'flag' => '🇬🇪', 'region' => 'europe'],
        'armenia'        => ['name_cn' => '亚美尼亚',   'name_en' => 'Armenia',        'flag' => '🇦🇲', 'region' => 'europe'],
        'azerbaijan'     => ['name_cn' => '阿塞拜疆',   'name_en' => 'Azerbaijan',     'flag' => '🇦🇿', 'region' => 'europe'],
        'kazakhstan'     => ['name_cn' => '哈萨克斯坦', 'name_en' => 'Kazakhstan',     'flag' => '🇰🇿', 'region' => 'europe'],
        // ── Asia ──────────────────────────────────────────────────
        'china'          => ['name_cn' => '中国',       'name_en' => 'China',          'flag' => '🇨🇳', 'region' => 'asia'],
        'japan'          => ['name_cn' => '日本',       'name_en' => 'Japan',          'flag' => '🇯🇵', 'region' => 'asia'],
        'korea'          => ['name_cn' => '韩国',       'name_en' => 'Korea',          'flag' => '🇰🇷', 'region' => 'asia'],
        'south'          => ['name_cn' => '韩国',       'name_en' => 'South Korea',    'flag' => '🇰🇷', 'region' => 'asia'],
        'australia'      => ['name_cn' => '澳大利亚',   'name_en' => 'Australia',      'flag' => '🇦🇺', 'region' => 'oceania'],
        'india'          => ['name_cn' => '印度',       'name_en' => 'India',          'flag' => '🇮🇳', 'region' => 'asia'],
        'thailand'       => ['name_cn' => '泰国',       'name_en' => 'Thailand',       'flag' => '🇹🇭', 'region' => 'asia'],
        'vietnam'        => ['name_cn' => '越南',       'name_en' => 'Vietnam',        'flag' => '🇻🇳', 'region' => 'asia'],
        'malaysia'       => ['name_cn' => '马来西亚',   'name_en' => 'Malaysia',       'flag' => '🇲🇾', 'region' => 'asia'],
        'singapore'      => ['name_cn' => '新加坡',     'name_en' => 'Singapore',      'flag' => '🇸🇬', 'region' => 'asia'],
        'indonesia'      => ['name_cn' => '印尼',       'name_en' => 'Indonesia',      'flag' => '🇮🇩', 'region' => 'asia'],
        'philippines'    => ['name_cn' => '菲律宾',     'name_en' => 'Philippines',    'flag' => '🇵🇭', 'region' => 'asia'],
        'hong'           => ['name_cn' => '香港',       'name_en' => 'Hong Kong',      'flag' => '🇭🇰', 'region' => 'asia'],
        'taiwan'         => ['name_cn' => '台湾',       'name_en' => 'Taiwan',         'flag' => '🇹🇼', 'region' => 'asia'],
        'iran'           => ['name_cn' => '伊朗',       'name_en' => 'Iran',           'flag' => '🇮🇷', 'region' => 'asia'],
        'iraq'           => ['name_cn' => '伊拉克',     'name_en' => 'Iraq',           'flag' => '🇮🇶', 'region' => 'asia'],
        'saudi'          => ['name_cn' => '沙特阿拉伯', 'name_en' => 'Saudi Arabia',   'flag' => '🇸🇦', 'region' => 'asia'],
        'qatar'          => ['name_cn' => '卡塔尔',     'name_en' => 'Qatar',          'flag' => '🇶🇦', 'region' => 'asia'],
        'uae'            => ['name_cn' => '阿联酋',     'name_en' => 'UAE',            'flag' => '🇦🇪', 'region' => 'asia'],
        'jordan'         => ['name_cn' => '约旦',       'name_en' => 'Jordan',         'flag' => '🇯🇴', 'region' => 'asia'],
        'lebanon'        => ['name_cn' => '黎巴嫩',     'name_en' => 'Lebanon',        'flag' => '🇱🇧', 'region' => 'asia'],
        'israel'         => ['name_cn' => '以色列',     'name_en' => 'Israel',         'flag' => '🇮🇱', 'region' => 'asia'],
        'uzbekistan'     => ['name_cn' => '乌兹别克斯坦','name_en'=> 'Uzbekistan',     'flag' => '🇺🇿', 'region' => 'asia'],
        // ── Americas ─────────────────────────────────────────────
        'usa'            => ['name_cn' => '美国',       'name_en' => 'United States',  'flag' => '🇺🇸', 'region' => 'americas'],
        'canada'         => ['name_cn' => '加拿大',     'name_en' => 'Canada',         'flag' => '🇨🇦', 'region' => 'americas'],
        'mexico'         => ['name_cn' => '墨西哥',     'name_en' => 'Mexico',         'flag' => '🇲🇽', 'region' => 'americas'],
        'brazil'         => ['name_cn' => '巴西',       'name_en' => 'Brazil',         'flag' => '🇧🇷', 'region' => 'americas'],
        'argentina'      => ['name_cn' => '阿根廷',     'name_en' => 'Argentina',      'flag' => '🇦🇷', 'region' => 'americas'],
        'chile'          => ['name_cn' => '智利',       'name_en' => 'Chile',          'flag' => '🇨🇱', 'region' => 'americas'],
        'colombia'       => ['name_cn' => '哥伦比亚',   'name_en' => 'Colombia',       'flag' => '🇨🇴', 'region' => 'americas'],
        'peru'           => ['name_cn' => '秘鲁',       'name_en' => 'Peru',           'flag' => '🇵🇪', 'region' => 'americas'],
        'uruguay'        => ['name_cn' => '乌拉圭',     'name_en' => 'Uruguay',        'flag' => '🇺🇾', 'region' => 'americas'],
        'paraguay'       => ['name_cn' => '巴拉圭',     'name_en' => 'Paraguay',       'flag' => '🇵🇾', 'region' => 'americas'],
        'ecuador'        => ['name_cn' => '厄瓜多尔',   'name_en' => 'Ecuador',        'flag' => '🇪🇨', 'region' => 'americas'],
        'bolivia'        => ['name_cn' => '玻利维亚',   'name_en' => 'Bolivia',        'flag' => '🇧🇴', 'region' => 'americas'],
        'venezuela'      => ['name_cn' => '委内瑞拉',   'name_en' => 'Venezuela',      'flag' => '🇻🇪', 'region' => 'americas'],
        'costa'          => ['name_cn' => '哥斯达黎加', 'name_en' => 'Costa Rica',     'flag' => '🇨🇷', 'region' => 'americas'],
        'panama'         => ['name_cn' => '巴拿马',     'name_en' => 'Panama',         'flag' => '🇵🇦', 'region' => 'americas'],
        'honduras'       => ['name_cn' => '洪都拉斯',   'name_en' => 'Honduras',       'flag' => '🇭🇳', 'region' => 'americas'],
        'guatemala'      => ['name_cn' => '危地马拉',   'name_en' => 'Guatemala',      'flag' => '🇬🇹', 'region' => 'americas'],
        'jamaica'        => ['name_cn' => '牙买加',     'name_en' => 'Jamaica',        'flag' => '🇯🇲', 'region' => 'americas'],
        'aruba'          => ['name_cn' => '阿鲁巴',     'name_en' => 'Aruba',          'flag' => '🇦🇼', 'region' => 'americas'],
        // ── Africa ────────────────────────────────────────────────
        'egypt'          => ['name_cn' => '埃及',       'name_en' => 'Egypt',          'flag' => '🇪🇬', 'region' => 'africa'],
        'morocco'        => ['name_cn' => '摩洛哥',     'name_en' => 'Morocco',        'flag' => '🇲🇦', 'region' => 'africa'],
        'algeria'        => ['name_cn' => '阿尔及利亚', 'name_en' => 'Algeria',        'flag' => '🇩🇿', 'region' => 'africa'],
        'tunisia'        => ['name_cn' => '突尼斯',     'name_en' => 'Tunisia',        'flag' => '🇹🇳', 'region' => 'africa'],
        'nigeria'        => ['name_cn' => '尼日利亚',   'name_en' => 'Nigeria',        'flag' => '🇳🇬', 'region' => 'africa'],
        'ghana'          => ['name_cn' => '加纳',       'name_en' => 'Ghana',          'flag' => '🇬🇭', 'region' => 'africa'],
        'cameroon'       => ['name_cn' => '喀麦隆',     'name_en' => 'Cameroon',       'flag' => '🇨🇲', 'region' => 'africa'],
        'kenya'          => ['name_cn' => '肯尼亚',     'name_en' => 'Kenya',          'flag' => '🇰🇪', 'region' => 'africa'],
        'ethiopia'       => ['name_cn' => '埃塞俄比亚', 'name_en' => 'Ethiopia',       'flag' => '🇪🇹', 'region' => 'africa'],
        'tanzania'       => ['name_cn' => '坦桑尼亚',   'name_en' => 'Tanzania',       'flag' => '🇹🇿', 'region' => 'africa'],
        'uganda'         => ['name_cn' => '乌干达',     'name_en' => 'Uganda',         'flag' => '🇺🇬', 'region' => 'africa'],
        'zambia'         => ['name_cn' => '赞比亚',     'name_en' => 'Zambia',         'flag' => '🇿🇲', 'region' => 'africa'],
        'zimbabwe'       => ['name_cn' => '津巴布韦',   'name_en' => 'Zimbabwe',       'flag' => '🇿🇼', 'region' => 'africa'],
        'south-africa'   => ['name_cn' => '南非',       'name_en' => 'South Africa',   'flag' => '🇿🇦', 'region' => 'africa'],
        'angola'         => ['name_cn' => '安哥拉',     'name_en' => 'Angola',         'flag' => '🇦🇴', 'region' => 'africa'],
        'senegal'        => ['name_cn' => '塞内加尔',   'name_en' => 'Senegal',        'flag' => '🇸🇳', 'region' => 'africa'],
        'ivory'          => ['name_cn' => '科特迪瓦',   'name_en' => 'Côte d\'Ivoire', 'flag' => '🇨🇮', 'region' => 'africa'],
        // ── Oceania ───────────────────────────────────────────────
        'new'            => ['name_cn' => '新西兰',     'name_en' => 'New Zealand',    'flag' => '🇳🇿', 'region' => 'oceania'],
        'fiji'           => ['name_cn' => '斐济',       'name_en' => 'Fiji',           'flag' => '🇫🇯', 'region' => 'oceania'],
        'vanuatu'        => ['name_cn' => '瓦努阿图',   'name_en' => 'Vanuatu',        'flag' => '🇻🇺', 'region' => 'oceania'],
        // ── International placeholders ────────────────────────────
        'world'          => ['name_cn' => '国际',       'name_en' => 'World',          'flag' => '🌐', 'region' => 'international'],
        'clubs'          => ['name_cn' => '俱乐部赛',   'name_en' => 'Clubs',          'flag' => '🌐', 'region' => 'international'],
        'youth'          => ['name_cn' => '青少年赛',   'name_en' => 'Youth',          'flag' => '🌐', 'region' => 'international'],
    ];

    // ---- public API ------------------------------------------------------

    /**
     * Look up a league by slug.  Returns the registry row (with `lid`,
     * `name_en`, `name_cn`, `region`, ...) or null when the slug is
     * unknown to the registry.
     */
    public static function getBySlug(PDO $pdo, string $slug): ?array
    {
        if ($slug === '') return null;
        if (isset(self::$memo[$slug])) {
            return self::$memo[$slug];
        }
        $cached = self::apcuGet('slug:' . $slug);
        if (is_array($cached)) {
            self::$memo[$slug] = $cached;
            return $cached;
        }
        $stmt = $pdo->prepare('SELECT * FROM foot_league WHERE slug = :slug LIMIT 1');
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        if (!$row) return null;
        self::$memo[$slug] = $row;
        self::apcuSet('slug:' . $slug, $row);
        return $row;
    }

    /** Convenience: slug → lid (int) or null. */
    public static function slugToLid(PDO $pdo, ?string $slug): ?int
    {
        if (!$slug) return null;
        $row = self::getBySlug($pdo, $slug);
        return $row ? (int)$row['lid'] : null;
    }

    /** Convenience: lid (int) → slug or fallback "league-<lid>". */
    public static function lidToSlug(PDO $pdo, ?int $lid): string
    {
        if ($lid === null) return '';
        $cached = self::apcuGet('lid:' . $lid);
        if (is_string($cached)) return $cached;
        $stmt = $pdo->prepare('SELECT slug FROM foot_league WHERE lid = :lid LIMIT 1');
        $stmt->execute([':lid' => $lid]);
        $slug = (string)($stmt->fetchColumn() ?: "league-{$lid}");
        self::apcuSet('lid:' . $lid, $slug);
        return $slug;
    }

    /**
     * Look up `slug` and INSERT a fresh row when missing.  Used by the
     * ingest cron to register newly-discovered leagues without manual
     * intervention.  $hint may carry `name_en`, `events_count`,
     * `apisports_id`, `priority` from the upstream payload — when
     * absent, region/country/flag/name_cn are derived from the slug.
     *
     * Returns the registry row (always non-null on success).
     */
    public static function resolveOrCreate(PDO $pdo, string $slug, array $hint = []): array
    {
        $existing = self::getBySlug($pdo, $slug);
        if ($existing) {
            // Refresh transient counters / metadata when the cron passes
            // newer numbers; never overwrite a curated name_cn unless the
            // hint explicitly asks via 'force_name_cn' => true.
            $sets = [];
            $params = [':slug' => $slug, ':ts' => time()];
            if (isset($hint['events_count'])) {
                $sets[] = 'events_count = :ec';
                $params[':ec'] = (int)$hint['events_count'];
            }
            if (isset($hint['name_en']) && $hint['name_en'] !== '') {
                $sets[] = 'name_en = :ne';
                $params[':ne'] = (string)$hint['name_en'];
            }
            if (isset($hint['apisports_id'])) {
                $sets[] = 'apisports_id = :asid';
                $params[':asid'] = (int)$hint['apisports_id'];
            }
            if (!empty($hint['force_name_cn']) && isset($hint['name_cn'])) {
                $sets[] = 'name_cn = :nc';
                $params[':nc'] = (string)$hint['name_cn'];
            }
            $sets[] = 'last_seen_ts = :ts';
            $sets[] = 'updated_ts = :ts';
            $sql = 'UPDATE foot_league SET ' . implode(', ', $sets) . ' WHERE slug = :slug';
            $pdo->prepare($sql)->execute($params);
            self::invalidate($slug, (int)$existing['lid']);
            return self::getBySlug($pdo, $slug) ?? $existing;
        }

        // New slug — derive metadata and INSERT.
        $derived = self::deriveMetadata($slug, $hint);
        $now = time();
        $cols = [
            'slug', 'name_en', 'name_cn', 'region', 'country', 'flag',
            'apisports_id', 'events_count', 'priority', 'enabled',
            'last_seen_ts', 'created_ts', 'updated_ts',
        ];
        $placeholders = array_map(fn($c) => ':' . $c, $cols);
        $sql = 'INSERT INTO foot_league (' . implode(', ', $cols) . ') VALUES (' . implode(', ', $placeholders) . ')';
        $params = [
            ':slug'         => $slug,
            ':name_en'      => (string)($hint['name_en'] ?? $derived['name_en']),
            ':name_cn'      => $derived['name_cn'],
            ':region'       => $derived['region'],
            ':country'      => $derived['country'],
            ':flag'         => $derived['flag'],
            ':apisports_id' => isset($hint['apisports_id']) ? (int)$hint['apisports_id'] : null,
            ':events_count' => (int)($hint['events_count'] ?? 0),
            ':priority'     => (int)($hint['priority'] ?? $derived['priority']),
            ':enabled'      => 1,
            ':last_seen_ts' => $now,
            ':created_ts'   => $now,
            ':updated_ts'   => $now,
        ];
        try {
            $pdo->prepare($sql)->execute($params);
        } catch (PDOException $e) {
            // Race: another process inserted the same slug between our
            // SELECT and INSERT.  Re-read and return that row.
            if ((int)$e->errorInfo[1] !== 1062) throw $e;
        }
        self::invalidate($slug, null);
        $row = self::getBySlug($pdo, $slug);
        return $row ?: ['slug' => $slug] + $params;
    }

    /** Return all enabled lids as an int[]; used by api_v2.php to build
     *  the IN-clause that replaces the old `lid BETWEEN 101 AND 109`. */
    public static function listEnabledLids(PDO $pdo): array
    {
        $cached = self::apcuGet('enabled_lids');
        if (is_array($cached)) return $cached;
        $rows = $pdo->query('SELECT lid FROM foot_league WHERE enabled = 1')->fetchAll();
        $out = array_map(fn($r) => (int)$r['lid'], $rows);
        self::apcuSet('enabled_lids', $out);
        return $out;
    }

    /** Same as listEnabledLids() but returns a SQL fragment for inline use,
     *  e.g. `WHERE lid IN (101,102,...)`.  Falls back to `IN (0)` when the
     *  registry is empty so the surrounding query returns no rows
     *  rather than syntax-erroring. */
    public static function enabledLidsSql(PDO $pdo): string
    {
        $lids = self::listEnabledLids($pdo);
        return $lids ? '(' . implode(',', $lids) . ')' : '(0)';
    }

    /** Tier-bounded variant: only lids with priority <= $maxPriority.
     *  Used by ingest_odds_api.php's --tier flag (top=1, major=10, all=∞). */
    public static function listLidsByTier(PDO $pdo, int $maxPriority): array
    {
        $cacheKey = 'tier_lids:' . $maxPriority;
        $cached = self::apcuGet($cacheKey);
        if (is_array($cached)) return $cached;
        $stmt = $pdo->prepare('SELECT lid, slug FROM foot_league WHERE enabled = 1 AND priority <= :p ORDER BY priority, lid');
        $stmt->execute([':p' => $maxPriority]);
        $out = $stmt->fetchAll();
        self::apcuSet($cacheKey, $out);
        return $out;
    }

    /**
     * Build the region/country/league tree consumed by the H5
     * DiscoverScreen.  Shape:
     *   [
     *     'regions' => [
     *       ['id'=>'europe', 'name_cn'=>'欧洲', 'flag'=>'🌍',
     *        'countries'=>[
     *          ['id'=>'england', 'name_cn'=>'英格兰', 'flag'=>'🏴..',
     *           'leagues'=>[
     *             ['lid'=>101, 'slug'=>'...', 'name_cn'=>'英超', 'priority'=>10, 'events_count'=>10]
     *           ]]
     *        ]],
     *       ...
     *     ],
     *     'total_leagues' => N,
     *   ]
     * Cached 60s in-process so the H5 catalog endpoint doesn't hammer
     * the DB even under aggressive polling.
     */
    public static function getCatalog(PDO $pdo, ?int $maxPriority = null): array
    {
        $now = time();
        $key = 'catalog:' . ($maxPriority ?? 'all');
        if (self::$catalogMemo !== null
            && isset(self::$catalogMemo[$key])
            && ($now - self::$catalogMemoTs) < 60) {
            return self::$catalogMemo[$key];
        }
        $cached = self::apcuGet($key);
        if (is_array($cached)) {
            self::$catalogMemo[$key] = $cached;
            self::$catalogMemoTs = $now;
            return $cached;
        }

        $sql = 'SELECT lid, slug, name_en, name_cn, region, country, flag,
                       apisports_id, events_count, priority
                FROM foot_league
                WHERE enabled = 1';
        $params = [];
        if ($maxPriority !== null) {
            $sql .= ' AND priority <= :p';
            $params[':p'] = $maxPriority;
        }
        $sql .= ' ORDER BY region, country, priority, name_en';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $regions = [];
        foreach ($rows as $r) {
            $rid = (string)($r['region'] ?: 'other');
            $cid = (string)($r['country'] ?: 'unknown');
            if (!isset($regions[$rid])) {
                $rmeta = self::regionMeta($rid);
                $regions[$rid] = [
                    'id'        => $rid,
                    'name_cn'   => $rmeta['name_cn'],
                    'name_en'   => $rmeta['name_en'],
                    'flag'      => $rmeta['flag'],
                    'countries' => [],
                ];
            }
            if (!isset($regions[$rid]['countries'][$cid])) {
                $cmeta = self::countryMeta($cid);
                $regions[$rid]['countries'][$cid] = [
                    'id'      => $cid,
                    'name_cn' => $cmeta['name_cn'] ?: $cid,
                    'name_en' => $cmeta['name_en'] ?: $cid,
                    'flag'    => (string)($r['flag'] ?: $cmeta['flag']),
                    'leagues' => [],
                ];
            }
            $regions[$rid]['countries'][$cid]['leagues'][] = [
                'lid'          => (int)$r['lid'],
                'slug'         => $r['slug'],
                'name_en'      => $r['name_en'],
                'name_cn'      => (string)($r['name_cn'] ?? ''),
                'priority'     => (int)$r['priority'],
                'events_count' => (int)$r['events_count'],
                'apisports_id' => $r['apisports_id'] !== null ? (int)$r['apisports_id'] : null,
            ];
        }
        // Re-key as ordered arrays for JSON-friendly output.
        $regionsOut = [];
        foreach ($regions as $rg) {
            $rg['countries'] = array_values($rg['countries']);
            $regionsOut[] = $rg;
        }
        $payload = [
            'regions'       => $regionsOut,
            'total_leagues' => count($rows),
            'fetched_at'    => $now,
        ];
        self::$catalogMemo[$key] = $payload;
        self::$catalogMemoTs = $now;
        self::apcuSet($key, $payload);
        return $payload;
    }

    /** Free-text search by slug / name_en / name_cn / country.  Returns at most $limit rows. */
    public static function search(PDO $pdo, string $q, int $limit = 30): array
    {
        $q = trim($q);
        if ($q === '') return [];
        $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $q) . '%';
        $stmt = $pdo->prepare('
            SELECT lid, slug, name_en, name_cn, region, country, flag, priority, events_count
            FROM foot_league
            WHERE enabled = 1
              AND (slug LIKE :q OR name_en LIKE :q OR name_cn LIKE :q OR country LIKE :q)
            ORDER BY priority, events_count DESC, name_en
            LIMIT ' . (int)$limit . '
        ');
        $stmt->execute([':q' => $like]);
        return $stmt->fetchAll();
    }

    // ---- derivation ------------------------------------------------------

    /** Derive region/country/flag/name_cn/priority from a slug.
     *  Slug shape from Odds-API.io: `<country>-<league-name>` for clubs
     *  (`australia-nsw-league-one`), `international-<comp>` or
     *  `international-clubs-<comp>` for cross-country competitions. */
    public static function deriveMetadata(string $slug, array $hint = []): array
    {
        $slug = strtolower($slug);
        $parts = explode('-', $slug);
        $first = $parts[0] ?? '';
        $second = $parts[1] ?? '';
        $country = $first;
        $isInternational = false;
        if ($first === 'international') {
            $isInternational = true;
            $country = $second === 'clubs' ? 'world' : ($second ?: 'world');
        }
        $cmeta = self::countryMeta($country);
        $region = $isInternational ? 'international' : ($cmeta['region'] ?? 'other');
        $rmeta = self::regionMeta($region);
        $priority = self::derivePriority($slug, $isInternational);
        $nameEn = (string)($hint['name_en'] ?? self::titleizeSlug($slug));
        return [
            'name_en'  => $nameEn,
            'name_cn'  => null,                          // reserved for hand curation
            'region'   => $region,
            'country'  => $country,
            'flag'     => (string)($cmeta['flag'] ?: $rmeta['flag']),
            'priority' => $priority,
        ];
    }

    /** Tier guess from slug heuristics; gets refined by a human in the
     *  registry when a league deserves a different priority. */
    private static function derivePriority(string $slug, bool $intl): int
    {
        // PHP 7.4 compatibility: emulate str_contains / str_ends_with via strpos/substr.
        $has = static function (string $haystack, string $needle): bool {
            return $needle !== '' && strpos($haystack, $needle) !== false;
        };
        $ends = static function (string $haystack, string $needle): bool {
            $n = strlen($needle);
            return $n > 0 && substr($haystack, -$n) === $needle;
        };
        if ($intl) {
            if ($has($slug, 'world-cup')) return 1;
            if ($has($slug, 'champions-league')) return 1;
            if ($has($slug, 'europa-league')) return 1;
            if ($has($slug, 'conference-league')) return 5;
            if ($has($slug, 'nations-league')) return 5;
            if ($has($slug, 'youth') || $has($slug, 'u21') || $has($slug, 'u20') || $has($slug, 'u19')) return 80;
            if ($has($slug, 'friendly')) return 70;
            return 30;
        }
        // Top-tier league heuristics: country-(super-league|premier|primera|serie-a|bundesliga|ligue-1|eredivisie|primeira)
        if (preg_match('/(premier-league|laliga|la-liga|serie-a|bundesliga|ligue-1|super-league|eredivisie|primeira-liga|primera-division|primera-divisio)$/', $slug)) {
            return 10;
        }
        if (preg_match('/^[a-z]+-(?:cup|copa|coppa|coupe|fa-cup|federation-cup)$/', $slug)) {
            return 30;
        }
        if ($has($slug, 'women') || $has($slug, '-w-') || $ends($slug, '-women')) return 80;
        if ($has($slug, 'reserves') || $has($slug, 'youth') || preg_match('/-u(?:17|19|20|21|23)\b/', $slug)) return 90;
        if (preg_match('/-(?:2|3|4|5)$/', $slug) || preg_match('/-(?:liga|liga-2|division-2|division-3|league-two|league-one|kakkonen|kolmonen)/', $slug)) return 60;
        return 50;
    }

    private static function titleizeSlug(string $slug): string
    {
        $parts = array_map(
            fn($p) => strlen($p) <= 3 ? strtoupper($p) : ucfirst($p),
            explode('-', $slug)
        );
        return implode(' ', $parts);
    }

    /** Country slug → display metadata.  Anything not in this table
     *  surfaces as the slug capitalised, with no flag. */
    private static function countryMeta(string $country): array
    {
        return self::COUNTRY_META[$country] ?? [
            'name_en' => self::titleizeSlug($country),
            'name_cn' => '',
            'flag'    => '',
            'region'  => 'other',
        ];
    }

    /** Region slug → display metadata. */
    private static function regionMeta(string $region): array
    {
        return self::REGION_META[$region] ?? [
            'name_cn' => '其他',
            'name_en' => 'Other',
            'flag'    => '🏳️',
        ];
    }

    // ---- APCu helpers (silent no-op when the extension isn't loaded) ----

    private static function apcuGet(string $key)
    {
        if (!function_exists('apcu_fetch')) return null;
        $ok = false;
        $v = apcu_fetch(self::APCU_PREFIX . $key, $ok);
        return $ok ? $v : null;
    }

    private static function apcuSet(string $key, $value): void
    {
        if (!function_exists('apcu_store')) return;
        apcu_store(self::APCU_PREFIX . $key, $value, self::TTL);
    }

    /** Invalidate cache entries for one slug+lid (call after writes). */
    private static function invalidate(string $slug, ?int $lid): void
    {
        unset(self::$memo[$slug]);
        self::$catalogMemo = null;
        if (function_exists('apcu_delete')) {
            apcu_delete(self::APCU_PREFIX . 'slug:' . $slug);
            apcu_delete(self::APCU_PREFIX . 'enabled_lids');
            apcu_delete(self::APCU_PREFIX . 'catalog:all');
            for ($p = 1; $p <= 100; $p++) {
                apcu_delete(self::APCU_PREFIX . 'catalog:' . $p);
                apcu_delete(self::APCU_PREFIX . 'tier_lids:' . $p);
            }
            if ($lid !== null) {
                apcu_delete(self::APCU_PREFIX . 'lid:' . $lid);
            }
        }
    }
}
