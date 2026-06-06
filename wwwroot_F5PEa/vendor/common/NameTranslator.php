<?php
/**
 * NameTranslator — English → Simplified-Chinese display-name cache for team
 * and league names.
 *
 * Product decision (2026-06-01): the H5 sports list must render team and
 * league names in Chinese, never a mix of English/Chinese.  The chosen
 * approach is HYBRID:
 *
 *   1. Authoritative curated dictionary lives in the H5 frontend
 *      (`src/lib/i18n-teams.ts`, ~1.7k hand-checked entries) and ALWAYS
 *      wins at display time — its quality beats any machine translation
 *      for well-known clubs/leagues (e.g. "阿森纳", "意甲").
 *   2. This backend cache fills the long tail: any English name the curated
 *      dictionary doesn't cover is machine-translated ONCE by a pluggable
 *      online provider and cached forever in `db_sports.name_cn_cache`.
 *      api_v2.php / FastAPI then expose the cached Chinese as
 *      home_cn/away_cn/league_cn; the frontend prefers its curated dict,
 *      then this cached value, then (only transiently, until the backfill
 *      cron catches up) the raw English.
 *
 * The online provider is env-pluggable so the system works with no key out
 * of the box (free Google endpoint) and can be swapped for a keyed,
 * higher-quality / higher-quota provider in production:
 *
 *   TRANSLATE_PROVIDER = google_free (default) | google | deepl | libre | none
 *   TRANSLATE_API_KEY  = <key>           (google / deepl / keyed libre)
 *   TRANSLATE_API_URL  = <endpoint>      (libre / self-hosted override)
 *
 * `none` disables online translation entirely (curated dict only).
 *
 * The cache is written ONLY by the backfill cron (bdata/translate_names.php)
 * — api_v2.php and FastAPI never translate on the request path (no added
 * latency, no risk of a slow provider stalling the events feed).
 */
class NameTranslator
{
    const TABLE = 'name_cn_cache';

    /** Create the cache table if it doesn't exist. Safe to call every run. */
    public static function ensureTable(PDO $pdo): void
    {
        $pdo->exec(
            "CREATE TABLE IF NOT EXISTS `" . self::TABLE . "` (\n" .
            "  `name_en` VARCHAR(190) NOT NULL,\n" .
            "  `kind` ENUM('team','league','other') NOT NULL DEFAULT 'other',\n" .
            "  `name_cn` VARCHAR(255) NOT NULL,\n" .
            "  `src` VARCHAR(16) NOT NULL DEFAULT 'api',\n" .
            "  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" .
            "  PRIMARY KEY (`name_en`)\n" .
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        );
    }

    /**
     * Batch lookup. Returns [name_en => name_cn] for the supplied English
     * names that already have a cached Chinese translation. Names not yet
     * translated are simply absent from the result.
     */
    public static function lookup(PDO $pdo, array $names): array
    {
        $clean = [];
        foreach ($names as $n) {
            $n = trim((string)$n);
            if ($n !== '') $clean[$n] = true;
        }
        $clean = array_keys($clean);
        if (empty($clean)) return [];

        $out = [];
        // Chunk to keep the IN() list and bound-parameter count reasonable.
        foreach (array_chunk($clean, 200) as $chunk) {
            $place = implode(',', array_fill(0, count($chunk), '?'));
            $stmt = $pdo->prepare(
                "SELECT name_en, name_cn FROM `" . self::TABLE . "` WHERE name_en IN ($place)"
            );
            $stmt->execute($chunk);
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $cn = (string)($row['name_cn'] ?? '');
                if ($cn !== '') $out[(string)$row['name_en']] = $cn;
            }
        }
        return $out;
    }

    /** Upsert a cached translation. */
    public static function store(PDO $pdo, string $en, string $cn, string $kind = 'other', string $src = 'api'): void
    {
        $en = trim($en);
        $cn = trim($cn);
        if ($en === '' || $cn === '') return;
        $stmt = $pdo->prepare(
            "INSERT INTO `" . self::TABLE . "` (name_en, kind, name_cn, src) VALUES (:en, :kind, :cn, :src)\n" .
            "ON DUPLICATE KEY UPDATE name_cn = VALUES(name_cn), kind = VALUES(kind), src = VALUES(src)"
        );
        $stmt->execute([':en' => $en, ':kind' => $kind, ':cn' => $cn, ':src' => $src]);
    }

    /**
     * True when the string already contains a CJK ideograph — such names are
     * already Chinese (e.g. league `name_cn` from the registry) and must NOT
     * be re-translated or treated as an untranslated English string.
     */
    public static function isChinese(string $s): bool
    {
        return (bool)preg_match('/[\x{4e00}-\x{9fff}\x{3400}-\x{4dbf}]/u', $s);
    }

    /**
     * Translate one English string to Simplified Chinese via the configured
     * provider. Returns null on any failure (caller leaves it untranslated
     * for a later retry). Never throws.
     */
    public static function translate(string $text): ?string
    {
        $text = trim($text);
        if ($text === '') return null;
        if (self::isChinese($text)) return $text; // already Chinese

        $provider = strtolower((string)(getenv('TRANSLATE_PROVIDER') ?: 'google_free'));
        try {
            switch ($provider) {
                case 'none':       return null;
                case 'google':     return self::viaGoogleV2($text);
                case 'deepl':      return self::viaDeepL($text);
                case 'libre':      return self::viaLibre($text);
                case 'google_free':
                default:           return self::viaGoogleFree($text);
            }
        } catch (\Throwable $e) {
            return null;
        }
    }

    // ---- providers --------------------------------------------------------

    /** Unofficial, key-less Google endpoint. Good enough for a cached,
     *  rate-limited backfill; swap to a keyed provider for production scale. */
    private static function viaGoogleFree(string $text): ?string
    {
        $url = 'https://translate.googleapis.com/translate_a/single?client=gtx'
             . '&sl=en&tl=zh-CN&dt=t&q=' . rawurlencode($text);
        $body = self::httpGet($url);
        if ($body === null) return null;
        $data = json_decode($body, true);
        if (!is_array($data) || !isset($data[0]) || !is_array($data[0])) return null;
        $out = '';
        foreach ($data[0] as $seg) {
            if (is_array($seg) && isset($seg[0])) $out .= (string)$seg[0];
        }
        $out = trim($out);
        return $out !== '' ? $out : null;
    }

    /** Official Google Cloud Translation v2 (needs TRANSLATE_API_KEY). */
    private static function viaGoogleV2(string $text): ?string
    {
        $key = (string)getenv('TRANSLATE_API_KEY');
        if ($key === '') return null;
        $url = 'https://translation.googleapis.com/language/translate/v2?key=' . rawurlencode($key);
        $body = self::httpPost($url, http_build_query([
            'q' => $text, 'source' => 'en', 'target' => 'zh-CN', 'format' => 'text',
        ]), ['Content-Type: application/x-www-form-urlencoded']);
        if ($body === null) return null;
        $data = json_decode($body, true);
        $cn = $data['data']['translations'][0]['translatedText'] ?? null;
        return is_string($cn) && trim($cn) !== '' ? trim($cn) : null;
    }

    /** DeepL (free or pro). TRANSLATE_API_KEY required; URL auto-selected. */
    private static function viaDeepL(string $text): ?string
    {
        $key = (string)getenv('TRANSLATE_API_KEY');
        if ($key === '') return null;
        $base = (string)(getenv('TRANSLATE_API_URL') ?: '');
        if ($base === '') {
            $base = (substr($key, -3) === ':fx')
                ? 'https://api-free.deepl.com/v2/translate'
                : 'https://api.deepl.com/v2/translate';
        }
        $body = self::httpPost($base, http_build_query([
            'text' => $text, 'source_lang' => 'EN', 'target_lang' => 'ZH',
        ]), ['Authorization: DeepL-Auth-Key ' . $key, 'Content-Type: application/x-www-form-urlencoded']);
        if ($body === null) return null;
        $data = json_decode($body, true);
        $cn = $data['translations'][0]['text'] ?? null;
        return is_string($cn) && trim($cn) !== '' ? trim($cn) : null;
    }

    /** LibreTranslate (self-hosted or public). TRANSLATE_API_URL required. */
    private static function viaLibre(string $text): ?string
    {
        $base = (string)(getenv('TRANSLATE_API_URL') ?: '');
        if ($base === '') return null;
        $payload = ['q' => $text, 'source' => 'en', 'target' => 'zh', 'format' => 'text'];
        $key = (string)getenv('TRANSLATE_API_KEY');
        if ($key !== '') $payload['api_key'] = $key;
        $body = self::httpPost($base, json_encode($payload), ['Content-Type: application/json']);
        if ($body === null) return null;
        $data = json_decode($body, true);
        $cn = $data['translatedText'] ?? null;
        return is_string($cn) && trim($cn) !== '' ? trim($cn) : null;
    }

    // ---- http -------------------------------------------------------------

    private static function httpGet(string $url): ?string
    {
        return self::http($url, null, ['Accept: application/json']);
    }

    private static function httpPost(string $url, string $body, array $headers): ?string
    {
        return self::http($url, $body, $headers);
    }

    private static function http(string $url, ?string $body, array $headers): ?string
    {
        if (!function_exists('curl_init')) return null;
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT      => 'CrownGold-NameTranslator/1.0',
            CURLOPT_HTTPHEADER     => $headers,
        ]);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }
        $resp = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($resp === false || $code < 200 || $code >= 300) return null;
        return (string)$resp;
    }
}
