<?php
/**
 * OddsApiToCrownXml — Odds-API.io 的 odds 响应转成 Crown 上游兼容的 r_cn XML 格式
 *
 * 输出最终经 base64(gzdeflate(xml)) 编码后写入 db_sports.foot_match_xml.r_cn 列。
 * 解码侧由 vendor/common/function.php:de_string() 处理，SPA 的 game_more / 列表
 * 解析器 (worker.js + game_list.js) 期望此完整 XML 格式 — 即与 db_sports/
 * 备份里 foot_match_xml.r_cn 真实样本一致 (见 .notes/foot_match_xml_sample_r_cn.xml)。
 *
 * 覆盖范围（基于 Bet365 通过 Odds-API.io 实际返回的 market 命名 — 见
 * .notes/fixture_odds_61301267.json）：
 *   ML                    → M    独赢三选一
 *   Spread                → RE   亚洲让球 (主盘)
 *   Totals                → OU   大小 (主盘)
 *   Draw No Bet           → BH   主客二选一退平
 *   Double Chance         → DC   双重机会
 *   Both Teams To Score   → TS   双方进球
 *   Spread HT             → HR   半场让球
 *   Totals HT             → HOU  半场大小
 *   Half Time Result      → HM   半场独赢
 *   Correct Score         → PD   波胆 (<PD>...</PD> 子节点)
 *   Both Teams To Score HT→ HTS  半场双方进球
 *   European Handicap     → W3   欧洲让球 (3-way)
 *   Corners Totals        → CN_OU 角球大小  (写入 corner block)
 *   Corners Spread        → CN_R  角球让球
 *   Bookings Totals       → CD_OU 罚牌大小 (黄牌+红牌点数)
 *   Number of Cards In Match → MWC  全场总罚牌数
 *
 * 未覆盖的 wtype 留 `<sw_XXX>N</sw_XXX>` + 空赔率，SPA 会自动隐藏对应盘口块。
 *
 * 调用约定：
 *     $builder = new OddsApiToCrownXml();
 *     $xml = $builder->buildR($event, $oddsResponse, 'zh-cn');
 *     $encoded = base64_encode(gzdeflate($xml));
 *     UPDATE foot_match_xml SET r_cn=$encoded, is_r=1, r_up_time=time() ...
 */
class OddsApiToCrownXml
{
    /** 当前事件 (Odds-API events 响应中的一条) */
    private $event = [];

    /** 当前赔率 (Odds-API /odds 响应中 bookmakers 选定项) */
    private $markets = [];

    /** 按 market name 索引到 odds 数组 */
    private $byMarket = [];

    /** 输出语言 zh-cn / zh-tw / en-us, 影响 league/team 字段填充 */
    private $langx = 'zh-cn';

    /** 内部 lid (Crown foot_match.lid)，由调用方注入，写入 <lid> 标签 */
    private $internalLid = 0;

    /**
     * 把一个事件 + bookmaker odds 转成 r_cn 用的完整 XML 字符串。
     *
     * @param array  $event   /events 响应中的一条 (id, home, away, date, league.slug 等)
     * @param array  $odds    /odds  响应 (含 bookmakers 字典)
     * @param string $bookmaker  选用哪个 bookmaker key，默认 Bet365
     * @param string $langx      zh-cn|zh-tw|en-us
     * @param int    $internalLid  Crown 端内部联赛 id (e.g. 101 for 英超)
     * @return string  完整 XML，未编码
     */
    public function buildR(array $event, array $odds, string $bookmaker = 'Bet365', string $langx = 'zh-cn', int $internalLid = 0): string
    {
        $this->event = $event;
        $this->langx = $langx;
        $this->internalLid = $internalLid;
        $this->markets = $this->pickBookmaker($odds, $bookmaker);
        $this->byMarket = [];
        foreach ($this->markets as $m) {
            $name = $m['name'] ?? '';
            if ($name === '') continue;
            if (!isset($this->byMarket[$name])) {
                $this->byMarket[$name] = $m['odds'] ?? [];
            } else {
                $this->byMarket[$name] = array_merge($this->byMarket[$name], $m['odds'] ?? []);
            }
        }

        $xml  = $this->header();
        $xml .= $this->blockMain();
        $xml .= $this->blockHalfTime();
        $xml .= $this->blockExtra();
        $xml .= $this->blockCorrectScore();
        $xml .= $this->blockExtended();
        $xml .= $this->footer();
        return $xml;
    }

    // ------------------------------------------------------------------
    // 输入选择
    // ------------------------------------------------------------------

    /**
     * Odds-API 的 bookmakers 字段是字典： {"Bet365": [...], "Bet365 (no latency)": [...]}
     * 抽取首选 key 的 market 数组；找不到就退回第一个 key。
     */
    private function pickBookmaker(array $odds, string $prefer): array
    {
        $bks = $odds['bookmakers'] ?? [];
        if (!is_array($bks) || empty($bks)) return [];
        if (isset($bks[$prefer]) && is_array($bks[$prefer])) {
            return $bks[$prefer];
        }
        foreach ($bks as $arr) {
            if (is_array($arr)) return $arr;
        }
        return [];
    }

    /** 取某 market 的第一行 odds（多数主盘只有 1 行） */
    private function row(string $marketName, int $idx = 0): array
    {
        $rows = $this->byMarket[$marketName] ?? [];
        return $rows[$idx] ?? [];
    }

    /** market 是否存在 */
    private function has(string $marketName): bool
    {
        return !empty($this->byMarket[$marketName] ?? []);
    }

    /** float 格式化为 "0.000" 三位小数；缺失为 0；用作 SPA 显示 */
    private function f($v): string
    {
        if ($v === null || $v === '' || !is_numeric($v)) return '0';
        return number_format((float)$v, 3, '.', '');
    }

    // ------------------------------------------------------------------
    // XML 片段构造
    // ------------------------------------------------------------------

    /**
     * 比赛元数据头部 (gtype, gid, datetime, 队名, 联赛 …)。
     * 让球方向 (strong) 由 Spread 主盘的 hdp 符号决定:
     *   hdp < 0  → 主队让 (strong=H)
     *   hdp > 0  → 客队让 (strong=C)
     */
    private function header(): string
    {
        $ev = $this->event;
        $gid = (int)($ev['id'] ?? 0);
        // 旧系统的 gidm 通常比 gid 稍小但保持稳定即可；这里取 gid 来简化
        $gidm = $gid;
        $date = $ev['date'] ?? '';
        $ts = $date ? strtotime($date) : time();
        $datetimeStr = $ts ? date('Y-m-d H:i:s', $ts) : '';
        $reTime = $ts ? date('H:i', $ts) : '';

        $home = (string)($ev['home'] ?? '');
        $away = (string)($ev['away'] ?? '');
        $league = (string)($ev['league']['name'] ?? '');

        // Spread 让球方向
        $spread = $this->row('Spread');
        $hdp = isset($spread['hdp']) ? (float)$spread['hdp'] : 0.0;
        $strong = ($hdp < 0) ? 'C' : (($hdp > 0) ? 'H' : 'N');
        // Crown 约定：strong=H 表示主队让出 (主队是favorite)，对应 hdp<0
        if ($hdp < 0) $strong = 'H';
        elseif ($hdp > 0) $strong = 'C';
        else $strong = 'N';

        $isLive = (($ev['status'] ?? '') === 'live' || ($ev['status'] ?? '') === 'inplay') ? 'Y' : 'N';
        $scoreH = (string)($ev['scores']['home'] ?? '');
        $scoreC = (string)($ev['scores']['away'] ?? '');

        return ''
            . "<gtype>FT</gtype>"
            . "<gid>{$gid}</gid>"
            . "<gidm>{$gidm}</gidm>"
            . "<gidfl>0</gidfl>"
            . "<isFantasy>N</isFantasy>"
            . "<datetime>{$this->esc($datetimeStr)}</datetime>"
            . "<re_time>{$reTime}</re_time>"
            . "<dangerous>N</dangerous>"
            . "<league>{$this->esc($league)}</league>"
            . "<lid>" . ($this->internalLid ?: (int)($ev['leagueId'] ?? 0)) . "</lid>"
            . "<gnum_h>" . (int)($ev['homeId'] ?? 0) . "</gnum_h>"
            . "<gnum_c>" . (int)($ev['awayId'] ?? 0) . "</gnum_c>"
            . "<team_h>{$this->esc($home)}</team_h>"
            . "<team_c>{$this->esc($away)}</team_c>"
            . "<team_id_h>" . (int)($ev['homeId'] ?? 0) . "</team_id_h>"
            . "<team_id_c>" . (int)($ev['awayId'] ?? 0) . "</team_id_c>"
            . "<session></session><ms></ms>"
            . "<ptype_id>0</ptype_id><ptype></ptype>"
            . "<important></important>"
            . "<gopen>Y</gopen>"
            . "<recv>S</recv>"
            . "<strong>{$strong}</strong>"
            . "<score_h>{$scoreH}</score_h>"
            . "<score_c>{$scoreC}</score_c>"
            . "<is_rb>{$isLive}</is_rb>"
            . "<Live>{$isLive}</Live>";
    }

    /**
     * 主盘区块：独赢、让球、大小、和局退、双重机会、双方进球、欧洲让球
     */
    private function blockMain(): string
    {
        $x = '';

        // ML → M (3-way 独赢)
        $r = $this->row('ML');
        if ($r) {
            $x .= "<sw_M>Y</sw_M>"
                . "<ior_MH>{$this->f($r['home'] ?? 0)}</ior_MH>"
                . "<ior_MC>{$this->f($r['away'] ?? 0)}</ior_MC>"
                . "<ior_MN>{$this->f($r['draw'] ?? 0)}</ior_MN>";
        } else {
            $x .= "<sw_M>N</sw_M><ior_MH>0</ior_MH><ior_MC>0</ior_MC><ior_MN>0</ior_MN>";
        }

        // Spread → RE (亚洲让球，主盘)
        $r = $this->row('Spread');
        if ($r) {
            $hdp = abs((float)($r['hdp'] ?? 0));
            $x .= "<sw_RE>Y</sw_RE>"
                . "<ratio_re>{$hdp}</ratio_re>"
                . "<ior_REH>{$this->f($r['home'] ?? 0)}</ior_REH>"
                . "<ior_REC>{$this->f($r['away'] ?? 0)}</ior_REC>"
                // R = 早盘让球，与 RE 同值
                . "<sw_R>Y</sw_R>"
                . "<ratio_r>{$hdp}</ratio_r>"
                . "<ior_RH>{$this->f($r['home'] ?? 0)}</ior_RH>"
                . "<ior_RC>{$this->f($r['away'] ?? 0)}</ior_RC>";
        } else {
            $x .= "<sw_RE>N</sw_RE><sw_R>N</sw_R>";
        }

        // Totals → OU (大小，主盘)
        $r = $this->row('Totals');
        if ($r) {
            $hdp = (float)($r['hdp'] ?? 0);
            $x .= "<sw_OU>Y</sw_OU>"
                . "<ratio_o>{$hdp}</ratio_o>"
                . "<ratio_u>{$hdp}</ratio_u>"
                // SPA worker: ior_OUH = 大, ior_OUC = 小 (见 CatalogBridge 注释)
                . "<ior_OUH>{$this->f($r['over'] ?? 0)}</ior_OUH>"
                . "<ior_OUC>{$this->f($r['under'] ?? 0)}</ior_OUC>"
                . "<sw_ROU>Y</sw_ROU>"
                . "<ratio_rouo>{$hdp}</ratio_rouo>"
                . "<ratio_rouu>{$hdp}</ratio_rouu>"
                . "<ior_ROUC>{$this->f($r['over'] ?? 0)}</ior_ROUC>"
                . "<ior_ROUH>{$this->f($r['under'] ?? 0)}</ior_ROUH>";
        } else {
            $x .= "<sw_OU>N</sw_OU><sw_ROU>N</sw_ROU>";
        }

        // EO (单/双) — Odds-API 中无对应主市场，留空
        $x .= "<sw_EO>N</sw_EO><ior_EOO>0</ior_EOO><ior_EOE>0</ior_EOE>";

        // Draw No Bet → BH (二选一退平)
        $r = $this->row('Draw No Bet');
        if ($r) {
            $x .= "<sw_BH>Y</sw_BH>"
                . "<ior_BHH>{$this->f($r['home'] ?? 0)}</ior_BHH>"
                . "<ior_BHC>{$this->f($r['away'] ?? 0)}</ior_BHC>";
        } else {
            $x .= "<sw_BH>N</sw_BH>";
        }

        // Double Chance → DC (3 行: 主+平, 客+平, 主+客)
        // Odds-API DC labels 使用缩写队名 ("Brighton or Draw", "Draw or Man Utd")，
        // 直接 strpos(全名) 经常失败。用 3 字母前缀匹配兼顾鲁棒性。
        $dc = $this->byMarket['Double Chance'] ?? [];
        if (!empty($dc)) {
            $homePrefix = $this->teamPrefix($this->event['home'] ?? '');
            $awayPrefix = $this->teamPrefix($this->event['away'] ?? '');
            $ior_hn = 0; $ior_cn = 0; $ior_hc = 0;
            foreach ($dc as $row) {
                $label = strtolower($row['label'] ?? '');
                $price = (float)($row['under'] ?? 0);
                $hasHome = $homePrefix !== '' && strpos($label, $homePrefix) !== false;
                $hasAway = $awayPrefix !== '' && strpos($label, $awayPrefix) !== false;
                $hasDraw = strpos($label, 'draw') !== false || strpos($label, 'tie') !== false;
                if ($hasHome && $hasDraw)        $ior_hn = $price;  // 主或平
                elseif ($hasAway && $hasDraw)    $ior_cn = $price;  // 客或平
                elseif ($hasHome && $hasAway)    $ior_hc = $price;  // 主或客
            }
            $x .= "<sw_DC>Y</sw_DC>"
                . "<ior_DCHN>{$this->f($ior_hn)}</ior_DCHN>"
                . "<ior_DCCN>{$this->f($ior_cn)}</ior_DCCN>"
                . "<ior_DCHC>{$this->f($ior_hc)}</ior_DCHC>";
        } else {
            $x .= "<sw_DC>N</sw_DC>";
        }

        // Both Teams To Score → TS
        $r = $this->row('Both Teams To Score');
        if ($r) {
            $x .= "<sw_TS>Y</sw_TS>"
                . "<ratio_tsy>0</ratio_tsy><ratio_tsn>0</ratio_tsn>"
                . "<ior_TSY>{$this->f($r['yes'] ?? 0)}</ior_TSY>"
                . "<ior_TSN>{$this->f($r['no'] ?? 0)}</ior_TSN>";
        } else {
            $x .= "<sw_TS>N</sw_TS>";
        }

        // European Handicap → W3 (3-way 让球, hdp 取首行)
        $eh = $this->byMarket['European Handicap'] ?? [];
        if (!empty($eh)) {
            // 取整数让球，通常 +1/-1 这种
            $row = $eh[0];
            $hdp = (float)($row['hdp'] ?? 0);
            $w3h = (float)($row['home'] ?? 0);
            $w3c = (float)($row['away'] ?? 0);
            $w3n = (float)($row['draw'] ?? 0);
            $sign = $hdp >= 0 ? '+' : '';
            $x .= "<sw_W3>Y</sw_W3>"
                . "<ratio_w3h>" . ($hdp >= 0 ? "+{$hdp}" : "{$hdp}") . "</ratio_w3h>"
                . "<ratio_w3c>" . (-$hdp >= 0 ? "+" . abs($hdp) : "-" . abs($hdp)) . "</ratio_w3c>"
                . "<ratio_w3n>" . ($hdp >= 0 ? "+{$hdp}" : "{$hdp}") . "</ratio_w3n>"
                . "<ior_W3H>{$this->f($w3h)}</ior_W3H>"
                . "<ior_W3C>{$this->f($w3c)}</ior_W3C>"
                . "<ior_W3N>{$this->f($w3n)}</ior_W3N>";
        } else {
            $x .= "<sw_W3>N</sw_W3>";
        }

        return $x;
    }

    /**
     * 半场区块：HR (半场让球), HOU (半场大小), HM (半场独赢), HTS (半场双方进球)
     */
    private function blockHalfTime(): string
    {
        $x = '';

        // Half Time Result → HM (3-way)
        // Odds-API 返回 3 行: {label: "1"|"X"|"2" 或 team_name, hdp: 0, under: odds}
        $ht = $this->byMarket['Half Time Result'] ?? [];
        if (!empty($ht)) {
            $homePrefix = $this->teamPrefix($this->event['home'] ?? '');
            $awayPrefix = $this->teamPrefix($this->event['away'] ?? '');
            $hmh = 0; $hmc = 0; $hmn = 0;
            foreach ($ht as $row) {
                $label = strtolower($row['label'] ?? '');
                $price = (float)($row['under'] ?? 0);
                if ($label === '1' || ($homePrefix && strpos($label, $homePrefix) !== false)) $hmh = $price;
                elseif ($label === '2' || ($awayPrefix && strpos($label, $awayPrefix) !== false)) $hmc = $price;
                elseif ($label === 'x' || strpos($label, 'draw') !== false) $hmn = $price;
            }
            $x .= "<sw_HM>Y</sw_HM>"
                . "<ior_HMH>{$this->f($hmh)}</ior_HMH>"
                . "<ior_HMC>{$this->f($hmc)}</ior_HMC>"
                . "<ior_HMN>{$this->f($hmn)}</ior_HMN>";
        } else {
            $x .= "<sw_HM>N</sw_HM><ior_HMH>0</ior_HMH><ior_HMC>0</ior_HMC><ior_HMN>0</ior_HMN>";
        }

        // Spread HT → HR
        $r = $this->row('Spread HT');
        if ($r) {
            $hdp = abs((float)($r['hdp'] ?? 0));
            $x .= "<sw_HR>Y</sw_HR>"
                . "<hratio>{$hdp}</hratio>"
                . "<ior_HRH>{$this->f($r['home'] ?? 0)}</ior_HRH>"
                . "<ior_HRC>{$this->f($r['away'] ?? 0)}</ior_HRC>";
        } else {
            $x .= "<sw_HR>N</sw_HR>";
        }

        // Totals HT → HOU
        $r = $this->row('Totals HT');
        if ($r) {
            $hdp = (float)($r['hdp'] ?? 0);
            $x .= "<sw_HOU>Y</sw_HOU>"
                . "<ratio_ho>{$hdp}</ratio_ho><ratio_hu>{$hdp}</ratio_hu>"
                . "<ior_HOUH>{$this->f($r['over'] ?? 0)}</ior_HOUH>"
                . "<ior_HOUC>{$this->f($r['under'] ?? 0)}</ior_HOUC>";
        } else {
            $x .= "<sw_HOU>N</sw_HOU>";
        }

        // Both Teams To Score HT → HTS
        $r = $this->row('Both Teams To Score HT');
        if ($r) {
            $x .= "<sw_HTS>Y</sw_HTS>"
                . "<ratio_htsy>0</ratio_htsy><ratio_htsn>0</ratio_htsn>"
                . "<ior_HTSY>{$this->f($r['yes'] ?? 0)}</ior_HTSY>"
                . "<ior_HTSN>{$this->f($r['no'] ?? 0)}</ior_HTSN>";
        } else {
            $x .= "<sw_HTS>N</sw_HTS>";
        }

        // 半场单双 — 无对应市场，留空
        $x .= "<sw_HEO>N</sw_HEO><ior_HEOO>0</ior_HEOO><ior_HEOE>0</ior_HEOE>";

        // HT 总进球 0/1/2/over — Odds-API 无明确字段，留空
        $x .= "<sw_HT>N</sw_HT><ior_HT0>0</ior_HT0><ior_HT1>0</ior_HT1>"
            . "<ior_HT2>0</ior_HT2><ior_HTOV>0</ior_HTOV>";

        return $x;
    }

    /**
     * 额外盘口：角球、罚牌
     */
    private function blockExtra(): string
    {
        $x = '';

        // Corners Spread → AR (15min区间让球，借用 A 段)
        // 注：旧系统 AR 是 15min 区间，没有完全对应的全场角球让球；
        //     这里把角球数据映射到 AR/AOU 是经验性映射，便于 SPA 显示某个角球盘
        $r = $this->row('Corners Spread');
        if ($r) {
            $hdp = abs((float)($r['hdp'] ?? 0));
            $x .= "<sw_AR>Y</sw_AR>"
                . "<ratio_ar>{$hdp}</ratio_ar>"
                . "<ior_ARH>{$this->f($r['home'] ?? 0)}</ior_ARH>"
                . "<ior_ARC>{$this->f($r['away'] ?? 0)}</ior_ARC>";
        } else {
            $x .= "<sw_AR>N</sw_AR>";
        }

        // Corners Totals → AOU
        $r = $this->row('Corners Totals');
        if ($r) {
            $hdp = (float)($r['hdp'] ?? 0);
            $x .= "<sw_AOU>Y</sw_AOU>"
                . "<ratio_aouo>{$hdp}</ratio_aouo><ratio_aouu>{$hdp}</ratio_aouu>"
                . "<ior_AOUO>{$this->f($r['over'] ?? 0)}</ior_AOUO>"
                . "<ior_AOUU>{$this->f($r['under'] ?? 0)}</ior_AOUU>";
        } else {
            $x .= "<sw_AOU>N</sw_AOU>";
        }

        // 罚牌：Odds-API 给 Bookings Totals / Number of Cards In Match
        // 没有 Crown 端完全对应的 wtype，先留空
        $x .= "<sw_BR>N</sw_BR><sw_BOU>N</sw_BOU>";

        // 取胜方式 MW/MQ — 无对应
        $x .= "<sw_MW>N</sw_MW><ior_MWH>0</ior_MWH><ior_MWC>0</ior_MWC>"
            . "<ior_MWHOT>0</ior_MWHOT><ior_MWCOT>0</ior_MWCOT>"
            . "<ior_MWHPK>0</ior_MWHPK><ior_MWCPK>0</ior_MWCPK>";
        $x .= "<sw_MQ>N</sw_MQ><ior_MQH>0</ior_MQH><ior_MQC>0</ior_MQC>"
            . "<ior_MQHOT>0</ior_MQHOT><ior_MQCOT>0</ior_MQCOT>"
            . "<ior_MQHPK>0</ior_MQHPK><ior_MQCPK>0</ior_MQCPK>";

        return $x;
    }

    /**
     * 波胆区块 (PD 子节点)。Odds-API 的 Correct Score 返回多行 {label: "1-0", odds: 5.5}
     * Crown 端用 ior_HxCy 命名，如 1-0 → ior_H1C0；客胜则 ior_H0Cx 表示主 0 客 x。
     */
    private function blockCorrectScore(): string
    {
        $rows = $this->byMarket['Correct Score'] ?? [];
        if (empty($rows)) {
            return "<PD><sw_PD>N</sw_PD><sw_HPD>N</sw_HPD>"
                 . "<pd_rtypes></pd_rtypes><hpd_rtypes></hpd_rtypes>"
                 . "<pd_strong>N</pd_strong><hpd_strong>N</hpd_strong></PD>";
        }

        // 列出 SPA 期望的 rtypes (用样本里的顺序)
        $rtypes = [];
        $odds = []; // tag => price
        foreach ($rows as $row) {
            $label = (string)($row['label'] ?? '');
            $price = (float)($row['odds'] ?? 0);
            // "1-0", "0-1", "3-3"
            if (!preg_match('/^(\d+)\s*[-:]\s*(\d+)$/', $label, $m)) {
                file_put_contents('/tmp/unmatched_labels.txt', $label . "\n", FILE_APPEND);
                continue;
            }
            $h = (int)$m[1];
            $c = (int)$m[2];
            $tag = "H{$h}C{$c}";
            $odds[$tag] = $price;
            $rtypes[] = "{$h}-{$c}";
        }

        // pd_strong 由整体让球方向决定；这里简化为 'N'
        $x = "<PD><sw_PD>Y</sw_PD><sw_HPD>N</sw_HPD>"
           . "<pd_rtypes>" . implode('#', $rtypes) . "</pd_rtypes>"
           . "<hpd_rtypes></hpd_rtypes>"
           . "<pd_strong>N</pd_strong><hpd_strong>N</hpd_strong>";
        foreach ($odds as $tag => $price) {
            $x .= "<ior_{$tag}>{$this->f($price)}</ior_{$tag}>";
        }
        $x .= "</PD>";
        return $x;
    }

    /**
     * 扩展盘口区块 (2026-05-24 新增): Anytime Goalscorer / Bookings Totals /
     * Bookings Spread / Corners Spread / Alternative Goal Line / Alternative
     * Total Goals / European Handicap (multi-row).
     *
     * 这些 Crown XML 没有原生 wtype 标签，所以用列表格式存：
     *   <sw_X>Y/N</sw_X>   是否启用
     *   <X_LIST>row1|row2|...</X_LIST>  其中 row 内字段用 # 分隔
     *
     * 对单行盘口仍用 ior_/ratio_ 风格 (Bookings Totals / Bookings Spread /
     * Corners Spread)。reader 端 (api_v2.php::parseRcnMarkets +
     * crown-explorer rcn_parser.py) 必须保持同样格式。
     */
    private function blockExtended(): string
    {
        $x = '';

        // Anytime Goalscorer — 进球者 — multi-row (player => odds).
        // Bet365 returns each row as {label: "Player Name", hdp: 0.5,
        // over: "2.875"} — `over` is the "to score 1+ goals" price.
        $rows = $this->byMarket['Anytime Goalscorer'] ?? [];
        $items = [];
        foreach ($rows as $row) {
            $name = trim((string)($row['label'] ?? ''));
            $price = (float)($row['over'] ?? $row['under'] ?? $row['odds'] ?? $row['home'] ?? 0);
            if ($name === '' || $price <= 0) continue;
            // Strip our delimiters from player names defensively (almost
            // never collides — Bet365 returns plain Latin/Cyrillic names).
            $name = str_replace(['|', '#'], ['／', '＃'], $name);
            $items[] = $this->esc($name) . '#' . $this->f($price);
        }
        if (!empty($items)) {
            $x .= '<sw_AGS>Y</sw_AGS><AGS_LIST>' . implode('|', $items) . '</AGS_LIST>';
        } else {
            $x .= '<sw_AGS>N</sw_AGS>';
        }

        // Bookings Totals — 黄牌大小 — single row {hdp, over, under}
        $r = $this->row('Bookings Totals');
        if ($r) {
            $hdp = (float)($r['hdp'] ?? 0);
            $x .= '<sw_BTL>Y</sw_BTL>'
                . "<ratio_btl>{$hdp}</ratio_btl>"
                . "<ior_BTLO>{$this->f($r['over'] ?? 0)}</ior_BTLO>"
                . "<ior_BTLU>{$this->f($r['under'] ?? 0)}</ior_BTLU>";
        } else {
            $x .= '<sw_BTL>N</sw_BTL>';
        }

        // Bookings Spread — 黄牌让球 — single row
        $r = $this->row('Bookings Spread');
        if ($r) {
            $hdp = (float)($r['hdp'] ?? 0);
            $x .= '<sw_BSP>Y</sw_BSP>'
                . "<ratio_bsp>{$hdp}</ratio_bsp>"
                . "<ior_BSPH>{$this->f($r['home'] ?? 0)}</ior_BSPH>"
                . "<ior_BSPC>{$this->f($r['away'] ?? 0)}</ior_BSPC>";
        } else {
            $x .= '<sw_BSP>N</sw_BSP>';
        }

        // Corners Spread — 角球让球 — single row (canonical CSP tag; legacy
        // <sw_AR> still emitted by blockExtra() for SPA backwards compat).
        $r = $this->row('Corners Spread');
        if ($r) {
            $hdp = (float)($r['hdp'] ?? 0);
            $x .= '<sw_CSP>Y</sw_CSP>'
                . "<ratio_csp>{$hdp}</ratio_csp>"
                . "<ior_CSPH>{$this->f($r['home'] ?? 0)}</ior_CSPH>"
                . "<ior_CSPC>{$this->f($r['away'] ?? 0)}</ior_CSPC>";
        } else {
            $x .= '<sw_CSP>N</sw_CSP>';
        }

        // Alternative Goal Line — 进阶大小 — multi-row {hdp, over, under}
        $rows = $this->byMarket['Alternative Goal Line'] ?? [];
        $items = [];
        foreach ($rows as $row) {
            $hdp = isset($row['hdp']) ? (float)$row['hdp'] : null;
            $over  = (float)($row['over'] ?? 0);
            $under = (float)($row['under'] ?? 0);
            if ($hdp === null || ($over <= 0 && $under <= 0)) continue;
            $items[] = $hdp . '#' . $this->f($over) . '#' . $this->f($under);
        }
        if (!empty($items)) {
            $x .= '<sw_AGL>Y</sw_AGL><AGL_LIST>' . implode('|', $items) . '</AGL_LIST>';
        } else {
            $x .= '<sw_AGL>N</sw_AGL>';
        }

        // Alternative Total Goals — 进阶总进球 — multi-row {hdp, over, under}
        $rows = $this->byMarket['Alternative Total Goals'] ?? [];
        $items = [];
        foreach ($rows as $row) {
            $hdp = isset($row['hdp']) ? (float)$row['hdp'] : null;
            $over  = (float)($row['over'] ?? 0);
            $under = (float)($row['under'] ?? 0);
            if ($hdp === null || ($over <= 0 && $under <= 0)) continue;
            $items[] = $hdp . '#' . $this->f($over) . '#' . $this->f($under);
        }
        if (!empty($items)) {
            $x .= '<sw_ATG>Y</sw_ATG><ATG_LIST>' . implode('|', $items) . '</ATG_LIST>';
        } else {
            $x .= '<sw_ATG>N</sw_ATG>';
        }

        // European Handicap — 欧洲让球 (multi-row).  blockMain() already
        // wrote the legacy <sw_W3>/ratio_w3h block for the first row only;
        // here we add the full multi-line list so the H5 detail panel can
        // expose every alternative line (-3 / -2 / -1 / +1 / +2 / +3).
        $rows = $this->byMarket['European Handicap'] ?? [];
        $items = [];
        foreach ($rows as $row) {
            $hdp = isset($row['hdp']) ? (float)$row['hdp'] : null;
            $home = (float)($row['home'] ?? 0);
            $draw = (float)($row['draw'] ?? 0);
            $away = (float)($row['away'] ?? 0);
            if ($hdp === null) continue;
            if ($home <= 0 && $draw <= 0 && $away <= 0) continue;
            $items[] = $hdp . '#' . $this->f($home) . '#' . $this->f($draw) . '#' . $this->f($away);
        }
        if (!empty($items)) {
            $x .= '<sw_W3M>Y</sw_W3M><W3M_LIST>' . implode('|', $items) . '</W3M_LIST>';
        } else {
            $x .= '<sw_W3M>N</sw_W3M>';
        }

        return $x;
    }

    /**
     * XML 尾部：sys time + 杂项 (与样本对齐)
     */
    private function footer(): string
    {
        return "<midfield>N</midfield>"
             . "<eventid></eventid><eventid_phone></eventid_phone>"
             . "<mt></mt><mt_id></mt_id><mt_gtype>FT</mt_gtype>"
             . "<mt_sid></mt_sid><mt_lineups>N</mt_lineups>"
             . "<hot></hot><center_tv></center_tv>"
             . "<pfcolor_h>33CC00</pfcolor_h><pfcolor_c>00FFFF</pfcolor_c>"
             . "<systime>" . date('Y-m-d H:i:s') . "</systime>";
    }

    /** htmlspecialchars 但只针对 XML 危险字符 */
    private function esc(string $s): string
    {
        return htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    /**
     * 从球队全名提取一个用于在赔率 label 里搜索的小写前缀。
     * Odds-API 的 Double Chance / Half Time Result 等 market 会用缩写队名
     * (e.g. "Brighton" 而非 "Brighton & Hove Albion"，"Man Utd" 而非
     * "Manchester United")，所以全名 substring 匹配经常失败。
     *
     * 策略：取第一个有意义的单词的前 3-4 字符做小写前缀。
     *   "Brighton & Hove Albion" → "brig"
     *   "Manchester United"       → "manc"   (与 "Man Utd" 共享 "man")
     *   "Tottenham Hotspur"       → "tott"
     *   "FC Barcelona"            → "barc"   (跳过 "FC")
     *
     * 然后调用方对 label 用 strpos 匹配；为了让 "Manchester" 也能匹配
     * "Man Utd"，返回的前缀取前 3 字符。
     */
    private function teamPrefix(string $fullName): string
    {
        $words = preg_split('/\s+/', trim($fullName));
        if (!$words) return '';
        $stop = ['the', 'fc', 'ac', 'as', 'us', 'cf', 'sc', 'rcd', '1.', '1.fc'];
        foreach ($words as $w) {
            $low = strtolower(rtrim($w, '.'));
            if (in_array($low, $stop, true)) continue;
            if (strlen($low) < 3) continue;
            return substr($low, 0, 3);
        }
        // 退而求其次：取首词的前 3 字符
        return substr(strtolower($words[0]), 0, 3);
    }
}
