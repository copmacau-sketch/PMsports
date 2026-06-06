<?php
/**
 * DbBridge — 从 db_sports.foot_match + foot_match_xml 直接生成 SPA 兼容的 XML
 *
 * 替代 CatalogBridge（其从 data/catalog.json 读）。本类直接读 MySQL，配合
 * application/bdata/ingest_odds_api.php 的入库结果。挂载点同样在
 * transform.php 的 get_analysis 拦截 (line ~9234)，仅把 CatalogBridge 替换为本类。
 *
 * 公共方法（对应 SPA action）：
 *   getLeagueCount    →  顶部 tab 计数 (RB/今日/早盘/过关)
 *   getPageCount      →  左侧每个联赛 tab 计数
 *   getLeagueListAll  →  左侧联赛分类树 + 日期 tab
 *   getGameList       →  主列表（主盘口提取自 r_cn）
 *   getGameMore       →  详情页（直接解码 r_cn 完整 XML）
 */
class DbBridge {

    /** PDO 包装类，由构造函数注入 */
    private $db;

    /** 联赛 slug 段 → ['zh' => 中文名, 'flag' => SPA flag class] */
    private static $REGIONS = [
        'england-'       => ['zh' => '英格兰',   'flag' => 'gb-eng'],
        'italy-'         => ['zh' => '意大利',   'flag' => 'it'],
        'spain-'         => ['zh' => '西班牙',   'flag' => 'es'],
        'france-'        => ['zh' => '法国',     'flag' => 'fr'],
        'germany-'       => ['zh' => '德国',     'flag' => 'de'],
        'china-'         => ['zh' => '中国',     'flag' => 'cn'],
        'international-' => ['zh' => '国际赛事', 'flag' => 'int'],
    ];

    /**
     * 我们 ingest 的 lid 范围，与 ingest_odds_api.php 的 $LEAGUES 对应。
     * 用来过滤掉旧 Crown 历史数据（lid 通常是 6 位数字，如 104036），
     * 否则它们会在 SPA 联赛树里以"其他"分类泄露。
     */
    private const INGEST_LID_MIN = 101;
    private const INGEST_LID_MAX = 109;

    public function __construct($db_s = null) {
        if ($db_s === null) {
            global $db_s;
        }
        $this->db = $db_s;
    }

    /** 是否有任何 db_sports.foot_match 数据；transform.php 拦截前会先调它 */
    public function hasData(): bool {
        $row = $this->db->select("SELECT COUNT(*) AS c FROM db_sports.foot_match", "Row");
        return !empty($row) && (int)$row['c'] > 0;
    }

    // ==================================================================
    // get_league_count  —  顶部 tab 计数
    // ==================================================================

    public function getLeagueCount(array $params): string {
        $ts = $params['ts'] ?? '';
        $todayDate = date('Y-m-d');

        // 滚球 = is_inball=1
        // 今日 = m_date = 今天 (含滚球)
        // 早盘 = m_date > 今天
        // 仅统计我们 ingest 的联赛 (lid 101-108)，避免旧 Crown 数据掺入计数
        $lidMin = self::INGEST_LID_MIN; $lidMax = self::INGEST_LID_MAX;
        $rs = $this->db->select(
            "SELECT
                SUM(is_inball=1) AS live_cnt,
                SUM(m_date='{$todayDate}') AS today_cnt,
                SUM(m_date>'{$todayDate}') AS early_cnt,
                COUNT(*) AS total_cnt
             FROM db_sports.foot_match
             WHERE cancel=0 AND lid BETWEEN {$lidMin} AND {$lidMax}",
            "Row"
        );
        $live  = (int)($rs['live_cnt']  ?? 0);
        $today = (int)($rs['today_cnt'] ?? 0);
        $early = (int)($rs['early_cnt'] ?? 0);
        $total = (int)($rs['total_cnt'] ?? 0);

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . $this->esc($ts) . '</ts>';
        $xml .= '<count>' . $total . '</count>';
        $xml .= '<homePage_sw>N</homePage_sw>';
        $xml .= '<SPRB>0</SPRB><SPFU>0</SPFU><SPFT>0</SPFT><SPEM>0</SPEM><FS>0</FS>';
        $xml .= '<SPCUPFantasy>0</SPCUPFantasy><SPFantasy>0</SPFantasy><Fantasy_leg></Fantasy_leg>';
        $xml .= '<SPCUP_MAIN>0</SPCUP_MAIN><group_count>0</group_count>';
        $xml .= '<FS_cup_team></FS_cup_team><FT_cup_team></FT_cup_team>';
        $xml .= '<mode>N</mode><highlights_sw>N</highlights_sw><team_sw>N</team_sw>';
        $xml .= '<standings_sw>N</standings_sw><period></period><feed_sw>N</feed_sw>';
        $xml .= '<season_id></season_id><gameCountMode></gameCountMode>';
        $xml .= '<cup_featureEvent_sw>N</cup_featureEvent_sw><cup_standings_sw>N</cup_standings_sw>';
        $xml .= '<cup_winnerWidget_sw>N</cup_winnerWidget_sw><cup_secondaryBanner_sw>N</cup_secondaryBanner_sw>';
        $xml .= '<cup_tournamentOverview_sw>N</cup_tournamentOverview_sw><cup_postToFrontend_sw>N</cup_postToFrontend_sw>';
        $xml .= '<cup_tabSort></cup_tabSort>';

        // FT (足球) 计数
        $xml .= '<game>';
        $xml .= '<gtype>FT</gtype>';
        $xml .= '<RB_count>' . $live . '</RB_count>';
        $xml .= '<FT_count>' . ($today + $live) . '</FT_count>';
        $xml .= '<FU_count>' . $early . '</FU_count>';
        $xml .= '<NEXT1_count>' . $today . '</NEXT1_count>';
        $xml .= '<HOT_count>' . $today . '</HOT_count>';
        $xml .= '<P3_count>' . $total . '</P3_count>';
        $xml .= '<MIX_count>' . $today . '</MIX_count>';
        $xml .= '<Next1_count>' . $today . '</Next1_count>';
        $xml .= '<Next6_count>' . $total . '</Next6_count>';
        $xml .= '<FT_count_filter>' . $today . '</FT_count_filter>';
        $xml .= '<RB_count_filter>' . $live . '</RB_count_filter>';
        $xml .= '<FS_RB_count>0</FS_RB_count>';
        $xml .= '<FS_FT_count>0</FS_FT_count>';
        $xml .= '<FS_FU_count>0</FS_FU_count>';
        $xml .= '<FS_NEXT1_count>0</FS_NEXT1_count>';
        $xml .= '<FS_HOT_count>0</FS_HOT_count>';
        $xml .= '<FS_P3_count>0</FS_P3_count>';
        $xml .= '</game>';

        // 其他球种 0
        foreach (['BK','TN','BS','VB','ES'] as $gt) {
            $xml .= '<game><gtype>' . $gt . '</gtype>';
            $xml .= '<RB_count>0</RB_count><FT_count>0</FT_count><FU_count>0</FU_count>';
            $xml .= '<NEXT1_count>0</NEXT1_count><HOT_count>0</HOT_count><P3_count>0</P3_count>';
            $xml .= '<FS_RB_count>0</FS_RB_count><FS_FT_count>0</FS_FT_count><FS_FU_count>0</FS_FU_count>';
            $xml .= '</game>';
        }

        $xml .= '</serverresponse>';
        return $xml;
    }

    // ==================================================================
    // get_league_list_All  —  左侧联赛分类
    // ==================================================================

    public function getLeagueListAll(array $params): string {
        $ts       = $params['ts'] ?? '';
        $gtypeIn  = strtoupper($params['gtype'] ?? 'FT');
        $showtype = strtolower($params['showtype'] ?? 'early');
        $todayDate = date('Y-m-d');

        // 按 showtype 筛
        switch ($showtype) {
            case 'live':
                $where = "is_inball=1";
                break;
            case 'today': case 'hot': case 'soon':
                $where = "m_date='{$todayDate}'";
                break;
            case 'early': case 'parlay':
                $where = "m_date>'{$todayDate}'";
                break;
            default:
                $where = "1=1";
                break;
        }
        $lidMin = self::INGEST_LID_MIN; $lidMax = self::INGEST_LID_MAX;
        $where .= " AND cancel=0 AND lid BETWEEN {$lidMin} AND {$lidMax}";

        // GROUP BY lid，按 lid asc 排序保持稳定
        $sql = "SELECT lid, MAX(league) AS league_name, COUNT(*) AS n
                FROM db_sports.foot_match
                WHERE {$where}
                GROUP BY lid
                ORDER BY lid ASC";
        $rows = $this->db->select($sql);

        // 按 region 分组：lid 段 101-105 是欧洲五大联赛, 106-108 国际
        $regions = []; // region_zh => [['lid'=>..., 'name'=>...], ...]
        $flagOf  = [];
        foreach ($rows as $r) {
            $lid = (int)$r['lid'];
            $name = $r['league_name'];
            // 简单映射：lid 101 英 / 102 意 / 103 西 / 104 法 / 105 德 / 106-108 国际
            $regionZh = $this->lidRegion($lid);
            if (!isset($regions[$regionZh])) {
                $regions[$regionZh] = [];
                $flagOf[$regionZh] = $this->regionFlag($regionZh);
            }
            $regions[$regionZh][] = ['lid' => $lid, 'name' => $name];
        }

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>get_league_list_All</code>';
        $xml .= '<ts>' . $this->esc($ts) . '</ts>';
        $xml .= '<gtype>' . $this->esc($gtypeIn) . '</gtype>';
        $xml .= '<coupons></coupons>';
        $xml .= '<classifier>';
        $regionId = 0;
        foreach ($regions as $rname => $rleagues) {
            $regionId++;
            $flag = $this->esc($flagOf[$rname] ?? '');
            $xml .= '<region id="' . $regionId . '" '
                  . 'name="' . $this->esc($rname) . '" '
                  . 'sorttype="order" t_sort="" '
                  . 'flag_class="' . $flag . '">';
            foreach ($rleagues as $lg) {
                $xml .= '<league id="' . $lg['lid'] . '" '
                      . 'name="' . $this->esc($lg['name']) . '" '
                      . 'isFantasy="N"></league>';
            }
            $xml .= '</region>';
        }
        $xml .= '</classifier>';

        // 日期 tab (早盘用)
        $xml .= '<datelist>';
        $weekZh = ['日','一','二','三','四','五','六'];
        $base = time();
        for ($i = 1; $i <= 7; $i++) {
            $t = strtotime("+$i day", $base);
            $xml .= '<date_' . $i . '>';
            $xml .= '<month>' . date('m', $t) . '</month>';
            $xml .= '<date>' . date('d', $t) . '</date>';
            $xml .= '<week>' . $weekZh[date('w', $t)] . '</week>';
            $xml .= '</date_' . $i . '>';
        }
        $xml .= '</datelist>';

        $xml .= '</serverresponse>';
        return $xml;
    }

    // ==================================================================
    // get_page_count  —  每联赛的 tab 计数
    // ==================================================================

    public function getPageCount(array $params): string {
        $ts = $params['ts'] ?? '';
        $showtype = strtolower($params['showtype'] ?? 'today');
        $todayDate = date('Y-m-d');

        $lidMin = self::INGEST_LID_MIN; $lidMax = self::INGEST_LID_MAX;
        $sql = "SELECT lid,
                       SUM(is_inball=1)              AS live_cnt,
                       SUM(m_date='{$todayDate}')    AS today_cnt,
                       SUM(m_date>'{$todayDate}')    AS early_cnt,
                       COUNT(*)                       AS total_cnt
                FROM db_sports.foot_match
                WHERE cancel=0 AND lid BETWEEN {$lidMin} AND {$lidMax}
                GROUP BY lid";
        $rows = $this->db->select($sql);

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . $this->esc($ts) . '</ts>';
        $xml .= '<dataStatus>Y</dataStatus>';

        foreach ($rows as $r) {
            $lid   = (int)$r['lid'];
            $live  = (int)$r['live_cnt'];
            $today = (int)$r['today_cnt'];
            $early = (int)$r['early_cnt'];
            $total = (int)$r['total_cnt'];
            switch ($showtype) {
                case 'live':                                $main = $live;  break;
                case 'today': case 'hot': case 'soon':      $main = $today; break;
                case 'early': case 'parlay':                $main = $early; break;
                default:                                    $main = $total; break;
            }
            $xml .= '<pgcount id="' . $lid . '">';
            $xml .= '<MAIN>' . $main . '</MAIN>';
            $xml .= '<RB>' . $live . '</RB>';
            $xml .= '<FT>' . $today . '</FT>';
            $xml .= '<FU>' . $early . '</FU>';
            $xml .= '<NEXT1>' . $today . '</NEXT1>';
            $xml .= '<HOT>' . $today . '</HOT>';
            $xml .= '<P3>' . $total . '</P3>';
            $xml .= '<MIX>' . $today . '</MIX>';
            $xml .= '</pgcount>';
        }
        $xml .= '</serverresponse>';
        return $xml;
    }

    // ==================================================================
    // get_game_list  —  主列表（含部分主盘口字段从 r_cn 提取）
    // ==================================================================

    public function getGameList(array $params): string {
        $ts = $params['ts'] ?? '';
        $chgSortTS = $params['chgsortts'] ?? $params['chgSortTS'] ?? '';
        $showtype = strtolower($params['showtype'] ?? 'today');
        $todayDate = date('Y-m-d');
        $systime = date('Y-m-d H:i:s');

        // 筛选 — 全部 column 用 m.* 前缀以避开 foot_match_xml.m_date 同名冲突
        switch ($showtype) {
            case 'live':                                 $where = "m.is_inball=1"; break;
            case 'today': case 'hot': case 'soon':       $where = "m.m_date='{$todayDate}'"; break;
            case 'early':                                $where = "m.m_date>'{$todayDate}'"; break;
            default:                                     $where = "1=1"; break;
        }
        $lidMin = self::INGEST_LID_MIN; $lidMax = self::INGEST_LID_MAX;
        $where .= " AND m.cancel=0 AND m.lid BETWEEN {$lidMin} AND {$lidMax}";
        // 可选 lid 过滤
        if (!empty($params['lid'])) {
            $lid = (int)$params['lid'];
            $where .= " AND m.lid={$lid}";
        }

        $sql = "SELECT m.gid, m.lid, m.league, m.team_h, m.team_c, m.datetime,
                       m.m_date, m.m_time, m.score_h, m.score_c,
                       m.is_inball, m.is_hr_inball, m.strong, m.hgid,
                       x.r_cn
                FROM db_sports.foot_match m
                LEFT JOIN db_sports.foot_match_xml x ON x.gid = m.gid
                WHERE {$where}
                ORDER BY m.datetime ASC
                LIMIT 500";
        $rows = $this->db->select($sql);

        $myGameMap = ['live'=>'rb','today'=>'today','early'=>'early','hot'=>'today','soon'=>'today','parlay'=>'parlay'];
        $myGame = $myGameMap[$showtype] ?? 'today';

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . $this->esc($ts) . '</ts>';
        $xml .= '<chgsortts>' . $this->esc($chgSortTS) . '</chgsortts>';
        $xml .= '<nowShowtype>' . $this->esc($showtype) . '</nowShowtype>';
        $xml .= '<system_time>' . $systime . '</system_time>';
        $xml .= '<totalDataCount>' . count($rows) . '</totalDataCount>';
        $xml .= '<mygame_rtype></mygame_rtype>';
        $xml .= '<couponLid></couponLid>';

        foreach ($rows as $m) {
            $gid = (int)$m['gid'];
            $ecid = $gid;
            $hgid = (int)($m['hgid'] ?: ($gid + 100000));

            // 从 r_cn 提取主盘口赔率（如果 r_cn 没有则全 0）
            $od = $this->extractMainOdds($m['r_cn'] ?? '');

            // 显示时间 MM-DD HH:mm
            $ts2 = (int)$m['datetime'];
            $displayTime = $ts2 ? date('m-d H:i', $ts2) : '';

            $scoreH = (string)($m['score_h'] ?? '');
            $scoreC = (string)($m['score_c'] ?? '');
            $isRB = ((int)$m['is_inball']) ? 'Y' : 'N';
            $nowModel = $isRB === 'Y' ? 'FT' : 'HT';
            $strong = $m['strong'] ?? '';

            $xml .= '<ec id="ec' . $ecid . '" hasEC="Y" myGame="' . $myGame . '" groupName="" groupID="">';
            $xml .= '<game>';
            $xml .= '<gid>' . $gid . '</gid>';
            $xml .= '<hgid>' . $hgid . '</hgid>';
            $xml .= '<lid>' . (int)$m['lid'] . '</lid>';
            $xml .= '<league>' . $this->esc($m['league'] ?? '') . '</league>';
            $xml .= '<team_h>' . $this->esc($m['team_h'] ?? '') . '</team_h>';
            $xml .= '<team_c>' . $this->esc($m['team_c'] ?? '') . '</team_c>';
            $xml .= '<datetime>' . $displayTime . '</datetime>';
            $xml .= '<systime>' . $systime . '</systime>';
            $xml .= '<score_h>' . $scoreH . '</score_h>';
            $xml .= '<score_c>' . $scoreC . '</score_c>';
            $xml .= '<is_rb>' . $isRB . '</is_rb>';
            $xml .= '<now_model>' . $nowModel . '</now_model>';
            $xml .= '<gopen>Y</gopen>';
            $xml .= '<ptype></ptype>';
            $xml .= '<midfield>N</midfield>';
            $xml .= '<myGame>' . $myGame . '</myGame>';
            $xml .= '<redcard_h></redcard_h><redcard_c></redcard_c>';
            $xml .= '<retimeset></retimeset><nowset></nowset>';
            $xml .= '<end_game>N</end_game>';
            $xml .= '<pk_method></pk_method>';
            $xml .= '<ft_scroe_h></ft_scroe_h><ft_scroe_c></ft_scroe_c>';
            $xml .= '<main_score_h>' . $scoreH . '</main_score_h>';
            $xml .= '<main_score_c>' . $scoreC . '</main_score_c>';
            $xml .= '<pfcolor_h></pfcolor_h><pfcolor_c></pfcolor_c>';
            $xml .= '<pd_sw>Y</pd_sw>';
            $xml .= '<hpd_sw>N</hpd_sw>';
            $xml .= '<hnike>N</hnike><hgopen>N</hgopen>';
            $xml .= '<pd_rtypes></pd_rtypes><hpd_rtypes></hpd_rtypes>';
            $xml .= '<strong>' . $strong . '</strong>';
            $xml .= '<hstrong></hstrong>';

            // 让球 (RE)
            $xml .= '<ior_rh>' . $od['re_h'] . '</ior_rh>';
            $xml .= '<ior_rc>' . $od['re_c'] . '</ior_rc>';
            $xml .= '<ratio_r>' . $od['re_line'] . '</ratio_r>';

            // 大小 (OU)
            $xml .= '<ior_ouh>' . $od['ou_under'] . '</ior_ouh>';
            $xml .= '<ior_ouc>' . $od['ou_over']  . '</ior_ouc>';
            $xml .= '<ratio_ouo>' . $od['ou_line'] . '</ratio_ouo>';
            $xml .= '<ratio_ouu>' . $od['ou_line'] . '</ratio_ouu>';

            // 独赢 (M)
            $xml .= '<ior_mh>' . $od['m_h'] . '</ior_mh>';
            $xml .= '<ior_mc>' . $od['m_c'] . '</ior_mc>';
            $xml .= '<ior_mn>' . $od['m_n'] . '</ior_mn>';

            // 早盘/滚球同款 (兼容字段)
            $xml .= '<ior_reh>' . $od['re_h'] . '</ior_reh>';
            $xml .= '<ior_rec>' . $od['re_c'] . '</ior_rec>';
            $xml .= '<ratio_re>' . $od['re_line'] . '</ratio_re>';
            $xml .= '<ior_rouh>' . $od['ou_under'] . '</ior_rouh>';
            $xml .= '<ior_rouc>' . $od['ou_over']  . '</ior_rouc>';
            $xml .= '<ratio_rou>' . $od['ou_line'] . '</ratio_rou>';

            // 半场 (HR/HOU/HM)
            $xml .= '<ior_hreh>' . $od['hr_h'] . '</ior_hreh>';
            $xml .= '<ior_hrec>' . $od['hr_c'] . '</ior_hrec>';
            $xml .= '<ratio_hr>' . $od['hr_line'] . '</ratio_hr>';
            $xml .= '<ratio_hre>' . $od['hr_line'] . '</ratio_hre>';
            $xml .= '<ior_hrouh>' . $od['hou_under'] . '</ior_hrouh>';
            $xml .= '<ior_hrouc>' . $od['hou_over'] . '</ior_hrouc>';
            $xml .= '<ratio_houo>' . $od['hou_line'] . '</ratio_houo>';
            $xml .= '<ratio_houu>' . $od['hou_line'] . '</ratio_houu>';
            $xml .= '<ior_hrh>' . $od['hr_h'] . '</ior_hrh>';
            $xml .= '<ior_hrc>' . $od['hr_c'] . '</ior_hrc>';
            $xml .= '<ior_houh>' . $od['hou_under'] . '</ior_houh>';
            $xml .= '<ior_houc>' . $od['hou_over'] . '</ior_houc>';
            $xml .= '<ior_hmh>' . $od['hm_h'] . '</ior_hmh>';
            $xml .= '<ior_hmc>' . $od['hm_c'] . '</ior_hmc>';
            $xml .= '<ior_hmn>' . $od['hm_n'] . '</ior_hmn>';

            // 单/双 — 暂不支持
            $xml .= '<ior_eoo></ior_eoo><ior_eoe></ior_eoe>';
            $xml .= '<ior_heoo></ior_heoo><ior_heoe></ior_heoe>';
            $xml .= '<ior_reoo></ior_reoo><ior_reoe></ior_reoe>';
            $xml .= '<ior_hreoo></ior_hreoo><ior_hreoe></ior_hreoe>';
            $xml .= '<ior_rouho></ior_rouho><ior_rouhu></ior_rouhu>';
            $xml .= '<ior_rouco></ior_rouco><ior_roucu></ior_roucu>';
            $xml .= '<ior_rshy></ior_rshy><ior_rshn></ior_rshn>';
            $xml .= '<ior_rscy></ior_rscy><ior_rscn></ior_rscn>';
            $xml .= '<ior_rnch></ior_rnch><ior_rncc></ior_rncc>';
            $xml .= '<ior_rnbh></ior_rnbh><ior_rnbc></ior_rnbc>';

            // 角球大小 (AOU)
            $xml .= '<ior_aouo>' . $od['aou_over'] . '</ior_aouo>';
            $xml .= '<ior_aouu>' . $od['aou_under'] . '</ior_aouu>';
            $xml .= '<ratio_aouo>' . $od['aou_line'] . '</ratio_aouo>';

            // 计数
            $xml .= '<r_count>1</r_count>';
            $xml .= '<ou_count>1</ou_count>';
            $xml .= '<cn_count>' . ($od['aou_line'] ? 1 : 0) . '</cn_count>';
            $xml .= '<rn_count>0</rn_count>';
            $xml .= '<wi_count>0</wi_count>';
            $xml .= '<et_count>0</et_count>';
            $xml .= '<pk_count>0</pk_count>';
            $xml .= '<pd_count>25</pd_count>';
            $xml .= '<sfs_count>0</sfs_count>';
            $xml .= '<par_minlimit>10</par_minlimit>';
            $xml .= '<showtype>' . $myGame . '</showtype>';
            $xml .= '</game>';
            $xml .= '</ec>';
        }
        $xml .= '</serverresponse>';
        return $xml;
    }

    // ==================================================================
    // get_game_more  —  详情页（直接解码 r_cn 返回完整赔率 XML）
    // ==================================================================

    public function getGameMore(array $params): string {
        $ts = $params['ts'] ?? '';
        $ecid = (int)($params['ecid'] ?? $params['gid'] ?? 0);
        $systime = date('Y-m-d H:i:s');

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . $this->esc($ts) . '</ts>';
        $xml .= '<systime>' . $systime . '</systime>';

        if ($ecid > 0) {
            $row = $this->db->select(
                "SELECT m.gid, m.team_h, m.team_c, x.r_cn
                 FROM db_sports.foot_match m
                 JOIN db_sports.foot_match_xml x ON x.gid = m.gid
                 WHERE m.ecid = {$ecid} OR m.gid = {$ecid}
                 LIMIT 1",
                "Row"
            );
            if ($row && !empty($row['r_cn'])) {
                $decoded = @gzinflate(base64_decode($row['r_cn']));
                if ($decoded !== false) {
                    // 包裹一个 <game> 节点，匹配上游格式（master/mode/ptype 占位）
                    $xml .= '<game id="gid' . (int)$row['gid'] . '" master="Y" mode="NORMAL" ptype="">';
                    $xml .= $decoded;
                    $xml .= '</game>';
                }
            }
        }

        $xml .= '</serverresponse>';
        return $xml;
    }

    // ==================================================================
    // helpers
    // ==================================================================

    /**
     * 从 r_cn (base64+gzdeflate) 解码并 regex 抽取主盘口赔率。
     * 不做完整 XML 解析（一次抽 6-8 个字段，regex 比 SimpleXML 快 3-5 倍）。
     */
    private function extractMainOdds(string $rCnEncoded): array {
        $defaults = [
            're_h'=>0, 're_c'=>0, 're_line'=>0,
            'ou_over'=>0, 'ou_under'=>0, 'ou_line'=>0,
            'm_h'=>0, 'm_c'=>0, 'm_n'=>0,
            'hr_h'=>0, 'hr_c'=>0, 'hr_line'=>0,
            'hou_over'=>0, 'hou_under'=>0, 'hou_line'=>0,
            'hm_h'=>0, 'hm_c'=>0, 'hm_n'=>0,
            'aou_over'=>0, 'aou_under'=>0, 'aou_line'=>0,
        ];
        if (empty($rCnEncoded)) return $defaults;
        $xml = @gzinflate(base64_decode($rCnEncoded));
        if ($xml === false) return $defaults;

        $g = function($tag) use ($xml) {
            return preg_match('#<' . $tag . '>([^<]*)</' . $tag . '>#i', $xml, $m) ? trim($m[1]) : '';
        };
        return [
            're_h'      => $g('ior_REH'),
            're_c'      => $g('ior_REC'),
            're_line'   => $g('ratio_re'),
            'ou_over'   => $g('ior_OUH'),
            'ou_under'  => $g('ior_OUC'),
            'ou_line'   => $g('ratio_o'),
            'm_h'       => $g('ior_MH'),
            'm_c'       => $g('ior_MC'),
            'm_n'       => $g('ior_MN'),
            'hr_h'      => $g('ior_HRH'),
            'hr_c'      => $g('ior_HRC'),
            'hr_line'   => $g('hratio'),
            'hou_over'  => $g('ior_HOUH'),
            'hou_under' => $g('ior_HOUC'),
            'hou_line'  => $g('ratio_ho'),
            'hm_h'      => $g('ior_HMH'),
            'hm_c'      => $g('ior_HMC'),
            'hm_n'      => $g('ior_HMN'),
            'aou_over'  => $g('ior_AOUO'),
            'aou_under' => $g('ior_AOUU'),
            'aou_line'  => $g('ratio_aouo'),
        ];
    }

    /** lid → 中文区域名（与 ingest_odds_api.php 的 lid 段一致） */
    private function lidRegion(int $lid): string {
        if ($lid === 101) return '英格兰';
        if ($lid === 102) return '意大利';
        if ($lid === 103) return '西班牙';
        if ($lid === 104) return '法国';
        if ($lid === 105) return '德国';
        if ($lid >= 106 && $lid <= 108) return '国际赛事';
        return '其他';
    }

    private function regionFlag(string $regionZh): string {
        $map = ['英格兰'=>'gb-eng','意大利'=>'it','西班牙'=>'es','法国'=>'fr',
                '德国'=>'de','国际赛事'=>'int'];
        return $map[$regionZh] ?? '';
    }

    private function esc(string $s): string {
        return htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
