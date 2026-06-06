<?php
/**
 * CatalogBridge — reads catalog.json and produces XML responses
 * in the format the SPA expects from transform.php.
 */
class CatalogBridge {

    private $catalog = null;
    private $dataDir;

    public function __construct() {
        $this->dataDir = dirname(__DIR__) . '/data';
    }

    private function loadCatalog() {
        if ($this->catalog !== null) return $this->catalog;
        $file = $this->dataDir . '/catalog.json';
        if (!file_exists($file)) return null;
        $this->catalog = json_decode(file_get_contents($file), true);
        return $this->catalog;
    }

    /**
     * get_league_count — SPA home.js reads this to populate tab counts
     */
    public function getLeagueCount($params) {
        $cat = $this->loadCatalog();
        if (!$cat) return null;
        $ts = $params['ts'] ?? '';
        $matches = $cat['matches'] ?? [];

        $liveCount = 0;
        $todayCount = 0;
        $earlyCount = 0;
        $now = time();
        foreach ($matches as $m) {
            if ($m['status'] === 'live') {
                $liveCount++;
                $todayCount++;
            } else {
                $ct = strtotime($m['commence_time'] ?? '');
                if ($ct && gmdate('Y-m-d', $ct) === gmdate('Y-m-d', $now)) {
                    $todayCount++;
                } else {
                    $earlyCount++;
                }
            }
        }
        $total = count($matches);

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . htmlspecialchars($ts) . '</ts>';
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
        // Football game counts
        $xml .= '<game>';
        $xml .= '<gtype>FT</gtype>';
        $xml .= '<RB_count>' . $liveCount . '</RB_count>';
        $xml .= '<FT_count>' . $todayCount . '</FT_count>';
        $xml .= '<FU_count>' . $earlyCount . '</FU_count>';
        $xml .= '<NEXT1_count>' . $todayCount . '</NEXT1_count>';
        $xml .= '<HOT_count>' . $todayCount . '</HOT_count>';
        $xml .= '<P3_count>' . $total . '</P3_count>';
        $xml .= '<MIX_count>' . $todayCount . '</MIX_count>';
        $xml .= '<Next1_count>' . $todayCount . '</Next1_count>';
        $xml .= '<Next6_count>' . $total . '</Next6_count>';
        $xml .= '<FT_count_filter>' . $todayCount . '</FT_count_filter>';
        $xml .= '<RB_count_filter>' . $liveCount . '</RB_count_filter>';
        $xml .= '<FS_RB_count>0</FS_RB_count>';
        $xml .= '<FS_FT_count>0</FS_FT_count>';
        $xml .= '<FS_FU_count>0</FS_FU_count>';
        $xml .= '<FS_NEXT1_count>0</FS_NEXT1_count>';
        $xml .= '<FS_HOT_count>0</FS_HOT_count>';
        $xml .= '<FS_P3_count>0</FS_P3_count>';
        $xml .= '</game>';
        // Dummy game entries for other sports (SPA expects multiple <game> elements)
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

    /**
     * get_page_count — index_3.js reads this for per-league tab counts.
     * Must include <MAIN> element which game_list.js checks via pageCountHash["main"].
     * If pageCountHash["main"] === 0, the SPA forces "no data" view.
     */
    public function getPageCount($params) {
        $cat = $this->loadCatalog();
        if (!$cat) return null;
        $ts = $params['ts'] ?? '';
        $matches = $cat['matches'] ?? [];
        $showtype = strtolower($params['showtype'] ?? 'today');

        // Group matches by league_slug; must match the same lid scheme used in getLeagueListAll
        $byLeague = [];
        foreach ($matches as $m) {
            $slug = $m['league_slug'] ?? '';
            if (!isset($byLeague[$slug])) $byLeague[$slug] = [];
            $byLeague[$slug][] = $m;
        }

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . htmlspecialchars($ts) . '</ts>';
        $xml .= '<dataStatus>Y</dataStatus>';

        // Assign lids the same way as getLeagueListAll() so that pgcount ids
        // line up with the league ids the SPA was given.
        $lid = 1000;
        $now = time();
        foreach ($cat['leagues'] ?? [] as $lg) {
            $hasMatches = ($showtype === 'live')
                ? ($lg['live_count'] ?? 0) > 0
                : ($lg['count'] ?? 0) > 0;
            if (!$hasMatches) continue;
            $lid++;

            $slug = $lg['slug'];
            $leagueMatches = $byLeague[$slug] ?? [];
            $live = 0; $today = 0; $early = 0;
            foreach ($leagueMatches as $m) {
                if (($m['status'] ?? '') === 'live') { $live++; $today++; }
                else {
                    $ct = strtotime($m['commence_time'] ?? '');
                    if ($ct && gmdate('Y-m-d', $ct) === gmdate('Y-m-d', $now)) $today++;
                    else $early++;
                }
            }
            $total = count($leagueMatches);

            // MAIN is the count for the current showtype (main tab).
            // game_list.js: if pageCountHash["main"] === 0 -> showData=false -> "no data"
            switch ($showtype) {
                case 'live':                  $main = $live;  break;
                case 'today': case 'hot':
                case 'soon':  case 'mygame':  $main = $today; break;
                case 'early': case 'parlay':  $main = $early; break;
                default:                      $main = $total; break;
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

    /**
     * Map league slug to region (country) name in Chinese.
     */
    private function slugToRegion($slug) {
        if (strpos($slug, 'england-') === 0) return ['英格兰', 'gb-eng'];
        if (strpos($slug, 'italy-') === 0)   return ['意大利', 'it'];
        if (strpos($slug, 'spain-') === 0)   return ['西班牙', 'es'];
        if (strpos($slug, 'france-') === 0)  return ['法国',  'fr'];
        if (strpos($slug, 'germany-') === 0) return ['德国',  'de'];
        if (strpos($slug, 'international-') === 0) return ['国际赛事', 'int'];
        return ['其他', ''];
    }

    /**
     * get_league_list_All — returns league list in SPA classifier format.
     * The SPA expects:
     *   <code>get_league_list_All</code> (must match top.choice_leagueTab)
     *   <ts>, <gtype>, <coupons>, <classifier> (with regions/leagues), <datelist>
     */
    public function getLeagueListAll($params) {
        $cat = $this->loadCatalog();
        if (!$cat) return null;
        $ts        = $params['ts'] ?? '';
        $gtypeIn   = strtoupper($params['gtype'] ?? 'FT');
        $showtype  = strtolower($params['showtype'] ?? 'early');
        $leagues   = $cat['leagues'] ?? [];

        // Group leagues by region
        $regions = [];  // region_name => [ ['lid'=>..., 'name'=>...], ... ]
        $regionFlag = [];
        $lid = 1000;
        foreach ($leagues as $lg) {
            // Filter leagues with no matches for this showtype
            $hasMatches = false;
            if ($showtype === 'live') {
                $hasMatches = ($lg['live_count'] ?? 0) > 0;
            } else {
                $hasMatches = ($lg['count'] ?? 0) > 0;
            }
            if (!$hasMatches) continue;

            $lid++;
            list($regionName, $flag) = $this->slugToRegion($lg['slug']);
            if (!isset($regions[$regionName])) {
                $regions[$regionName] = [];
                $regionFlag[$regionName] = $flag;
            }
            $regions[$regionName][] = [
                'lid'  => $lid,
                'name' => $lg['name_zh'],
                'slug' => $lg['slug'],
            ];
        }

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>get_league_list_All</code>';
        $xml .= '<ts>' . htmlspecialchars($ts) . '</ts>';
        $xml .= '<gtype>' . htmlspecialchars($gtypeIn) . '</gtype>';
        $xml .= '<coupons></coupons>';

        // Classifier with regions and leagues
        $xml .= '<classifier>';
        $regionId = 0;
        foreach ($regions as $rname => $rleagues) {
            $regionId++;
            $flag = htmlspecialchars($regionFlag[$rname]);
            $xml .= '<region id="' . $regionId . '" '
                  . 'name="' . htmlspecialchars($rname) . '" '
                  . 'sorttype="order" t_sort="" '
                  . 'flag_class="' . $flag . '">';
            foreach ($rleagues as $lg) {
                $xml .= '<league id="' . $lg['lid'] . '" '
                      . 'name="' . htmlspecialchars($lg['name']) . '" '
                      . 'isFantasy="N"></league>';
            }
            $xml .= '</region>';
        }
        $xml .= '</classifier>';

        // Datelist for early/parlay showtype
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

    /**
     * get_game_list — full game data with odds in SPA XML format
     */
    public function getGameList($params) {
        $cat = $this->loadCatalog();
        if (!$cat) return null;
        $ts = $params['ts'] ?? '';
        $chgSortTS = $params['chgsortts'] ?? $params['chgSortTS'] ?? '';
        $showtype = strtolower($params['showtype'] ?? 'today');
        $matches = $cat['matches'] ?? [];
        $now = time();
        $systime = date('Y-m-d H:i:s');

        // Build slug -> lid map, mirroring the assignment in getLeagueListAll()
        // so each game's <lid> matches the league id the SPA already knows.
        // The SPA's worker uses `tmp_game["lid"]` to group games by league;
        // missing lid causes "Cannot read properties of undefined (reading 'split')".
        $slugLid = [];
        $lidCounter = 1000;
        foreach ($cat['leagues'] ?? [] as $lg) {
            $lidCounter++;
            $slugLid[$lg['slug']] = $lidCounter;
        }

        // Optional lid filter (from league click on left menu)
        $filterLid = $params['lid'] ?? '';

        // Filter matches by showtype (and optionally by lid)
        $filtered = [];
        foreach ($matches as $m) {
            $ct = strtotime($m['commence_time'] ?? '');
            $isLive = ($m['status'] === 'live');
            $isToday = ($ct && gmdate('Y-m-d', $ct) === gmdate('Y-m-d', $now));
            $matchLid = $slugLid[$m['league_slug'] ?? ''] ?? 0;

            // Apply lid filter (league click)
            if ($filterLid !== '' && (string)$matchLid !== (string)$filterLid) continue;

            switch ($showtype) {
                case 'live':
                    if ($isLive) $filtered[] = $m;
                    break;
                case 'today':
                case 'hot':
                case 'soon':
                    if ($isToday || $isLive) $filtered[] = $m;
                    break;
                case 'early':
                    if (!$isToday && !$isLive) $filtered[] = $m;
                    break;
                default:
                    $filtered[] = $m;
                    break;
            }
        }

        // Map showtype to myGame value
        $myGameMap = ['live'=>'rb','today'=>'today','early'=>'early','hot'=>'today','soon'=>'today','parlay'=>'parlay'];
        $myGame = $myGameMap[$showtype] ?? 'today';

        $xml  = '<?xml version="1.0" encoding="utf-8"?>';
        $xml .= '<serverresponse>';
        $xml .= '<code>601</code>';
        $xml .= '<ts>' . htmlspecialchars($ts) . '</ts>';
        $xml .= '<chgsortts>' . htmlspecialchars($chgSortTS) . '</chgsortts>';
        $xml .= '<nowShowtype>' . htmlspecialchars($showtype) . '</nowShowtype>';
        $xml .= '<system_time>' . $systime . '</system_time>';
        $xml .= '<totalDataCount>' . count($filtered) . '</totalDataCount>';
        $xml .= '<mygame_rtype></mygame_rtype>';
        $xml .= '<couponLid></couponLid>';

        foreach ($filtered as $m) {
            $gid = intval($m['id']);
            $hgid = $gid + 100000;
            $ecid = $gid;

            // Format datetime for SPA display: "MM-DD HH:mm" with dashes.
            // The worker's transDate splits on "-" (not "/"), and outputs
            // "MM<月>DD<日>"; using "/" causes "MM月undefined日".
            $ct = strtotime($m['commence_time'] ?? '');
            $displayTime = $ct ? date('m-d H:i', $ct) : '';

            // Extract odds from catalog
            $odds = $m['odds'] ?? [];
            $ml = $odds['ML'] ?? [];
            $spread = $odds['Spread'] ?? [];
            $ou = [];
            foreach (['Over/Under', 'Over Under', 'Totals'] as $k) {
                if (isset($odds[$k])) { $ou = $odds[$k]; break; }
            }

            // ML (1X2) odds
            $mlHome = ''; $mlDraw = ''; $mlAway = '';
            if (!empty($ml[0])) {
                $mlHome = $ml[0]['home'] ?? '';
                $mlDraw = $ml[0]['draw'] ?? '';
                $mlAway = $ml[0]['away'] ?? '';
            }

            // Spread/Handicap odds
            $spreadHome = ''; $spreadAway = ''; $hdp = '';
            if (!empty($spread[0])) {
                $hdp = $spread[0]['hdp'] ?? '';
                $spreadHome = $spread[0]['home'] ?? '';
                $spreadAway = $spread[0]['away'] ?? '';
            }

            // Over/Under odds
            $ouOver = ''; $ouUnder = ''; $ouLine = '';
            if (!empty($ou[0])) {
                $ouLine = $ou[0]['hdp'] ?? $ou[0]['total'] ?? '';
                $ouOver = $ou[0]['over'] ?? $ou[0]['home'] ?? '';
                $ouUnder = $ou[0]['under'] ?? $ou[0]['away'] ?? '';
            }

            // Live score data
            $live = $m['live'] ?? null;
            $scoreH = $live ? ($live['home_score'] ?? '') : '';
            $scoreC = $live ? ($live['away_score'] ?? '') : '';
            $isRB = ($m['status'] === 'live') ? 'Y' : 'N';
            // Pre-game (non-live) matches use "HT" model; the SPA template
            // `ft_early_game.html` only ships `model_HT`, not `model_FT`,
            // so the worker would discard the row if now_model = "FT".
            $nowModel = ($m['status'] === 'live') ? 'FT' : 'HT';
            // retimeset must use the format "<half>^<minute>'" or one of the
            // special tokens (Start, LIVE, MTIME, HT). Otherwise the SPA's
            // worker `transRETIME` will crash on `tmpHash[1].replace(...)`.
            $retimeset = '';
            $nowset = '';
            if ($live && isset($live['minute']) && $live['minute'] !== '') {
                $min = intval($live['minute']);
                if ($min <= 0)        { $retimeset = 'Start';            $nowset = '1H'; }
                elseif ($min < 45)    { $retimeset = "1H^{$min}'";       $nowset = '1H'; }
                elseif ($min == 45)   { $retimeset = 'MTIME';             $nowset = '1H'; }
                elseif ($min < 90)    { $retimeset = "2H^{$min}'";       $nowset = '2H'; }
                else                  { $retimeset = "2H^{$min}'";       $nowset = '2H'; }
            }

            // Handicap display: the SPA worker strips the trailing H/C from
            // placeholders like *RATIO_REH* / *RATIO_REC* and reads a single
            // `ratio_re` field, then prepends "+" or "-" based on `strong`:
            //   strong_reh="H" => home favored: RATIO_REH="-", RATIO_REC="+"
            //   strong_rec="C" => away favored: RATIO_REH="+", RATIO_REC="-"
            // We expose the absolute handicap value as `ratio_re`/`ratio_rou`.
            $ratioRE  = $hdp !== '' ? (string)abs($hdp) : '';
            $ratioROU = $ouLine !== '' ? (string)abs($ouLine) : '';

            // Determine strong side from the signed handicap.
            // The worker reads a single `strong` field ("H", "C" or "") and
            // formats *RATIO_REH*/*RATIO_REC* as +/- based on it.
            //   hdp < 0 => home favored => strong = "H"
            //   hdp > 0 => away favored => strong = "C"
            $strong = '';
            if ($hdp !== '' && is_numeric($hdp)) {
                if ((float)$hdp < 0)      $strong = 'H';
                elseif ((float)$hdp > 0)  $strong = 'C';
            }

            $matchLid = $slugLid[$m['league_slug'] ?? ''] ?? 0;

            $xml .= '<ec id="ec' . $ecid . '" hasEC="Y" myGame="' . $myGame . '" groupName="" groupID="">';
            $xml .= '<game>';
            $xml .= '<gid>' . $gid . '</gid>';
            $xml .= '<hgid>' . $hgid . '</hgid>';
            $xml .= '<lid>' . $matchLid . '</lid>';
            $xml .= '<league>' . htmlspecialchars($m['league'] ?? '') . '</league>';
            $xml .= '<team_h>' . htmlspecialchars($m['home'] ?? '') . '</team_h>';
            $xml .= '<team_c>' . htmlspecialchars($m['away'] ?? '') . '</team_c>';
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
            $xml .= '<redcard_h></redcard_h>';
            $xml .= '<redcard_c></redcard_c>';
            $xml .= '<retimeset>' . $retimeset . '</retimeset>';
            $xml .= '<nowset>' . $nowset . '</nowset>';
            $xml .= '<end_game>N</end_game>';
            $xml .= '<pk_method></pk_method>';
            $xml .= '<ft_scroe_h></ft_scroe_h>';
            $xml .= '<ft_scroe_c></ft_scroe_c>';
            $xml .= '<main_score_h>' . $scoreH . '</main_score_h>';
            $xml .= '<main_score_c>' . $scoreC . '</main_score_c>';
            $xml .= '<pfcolor_h></pfcolor_h>';
            $xml .= '<pfcolor_c></pfcolor_c>';
            $xml .= '<pd_sw>N</pd_sw>';
            $xml .= '<hpd_sw>N</hpd_sw>';
            $xml .= '<hnike>N</hnike>';
            $xml .= '<hgopen>N</hgopen>';
            $xml .= '<pd_rtypes></pd_rtypes>';
            $xml .= '<hpd_rtypes></hpd_rtypes>';
            // Strong-side marker (single field, used by both RATIO_RH/RC)
            $xml .= '<strong>' . $strong . '</strong>';
            $xml .= '<hstrong></hstrong>';

            // Asian Handicap (R = Run/Handicap). The template uses
            // *IOR_RH*, *IOR_RC*, *RATIO_RH*, *RATIO_RC*. The worker strips
            // the last char from RATIO_RH/RC and reads `ratio_r` (single
            // field) then prepends +/- based on `strong`.
            $xml .= '<ior_rh>' . $spreadHome . '</ior_rh>';
            $xml .= '<ior_rc>' . $spreadAway . '</ior_rc>';
            $xml .= '<ratio_r>' . $ratioRE . '</ratio_r>';

            // Over/Under main. Template: *IOR_OUH*=under, *IOR_OUC*=over,
            // *RATIO_OUO*/*RATIO_OUU* = the same line value (e.g. 2.5).
            $xml .= '<ior_ouh>' . $ouUnder . '</ior_ouh>';
            $xml .= '<ior_ouc>' . $ouOver . '</ior_ouc>';
            $xml .= '<ratio_ouo>' . $ratioROU . '</ratio_ouo>';
            $xml .= '<ratio_ouu>' . $ratioROU . '</ratio_ouu>';

            // 1X2 / Money line (M = Money). Template: *IOR_MH*, *IOR_MC*, *IOR_MN*.
            $xml .= '<ior_mh>' . $mlHome . '</ior_mh>';
            $xml .= '<ior_mc>' . $mlAway . '</ior_mc>';
            $xml .= '<ior_mn>' . $mlDraw . '</ior_mn>';

            // Legacy/compat field names that some worker paths still inspect
            // (Asian variant `ior_re*` / `ratio_re`).
            $xml .= '<ior_reh>' . $spreadHome . '</ior_reh>';
            $xml .= '<ior_rec>' . $spreadAway . '</ior_rec>';
            $xml .= '<ratio_re>' . $ratioRE . '</ratio_re>';
            $xml .= '<ior_rouh>' . $ouUnder . '</ior_rouh>';
            $xml .= '<ior_rouc>' . $ouOver . '</ior_rouc>';
            $xml .= '<ratio_rou>' . $ratioROU . '</ratio_rou>';

            // Half-time fields (we don't expose half-time markets yet)
            $xml .= '<ior_hreh></ior_hreh><ior_hrec></ior_hrec>';
            $xml .= '<ratio_hr></ratio_hr><ratio_hre></ratio_hre>';
            $xml .= '<ior_hrouh></ior_hrouh><ior_hrouc></ior_hrouc>';
            $xml .= '<ratio_houo></ratio_houo><ratio_houu></ratio_houu>';
            $xml .= '<ior_hrh></ior_hrh><ior_hrc></ior_hrc>';
            $xml .= '<ior_houh></ior_houh><ior_houc></ior_houc>';
            $xml .= '<ior_hmh></ior_hmh><ior_hmc></ior_hmc><ior_hmn></ior_hmn>';
            // Even/Odd
            $xml .= '<ior_eoo></ior_eoo><ior_eoe></ior_eoe>';
            $xml .= '<ior_heoo></ior_heoo><ior_heoe></ior_heoe>';
            $xml .= '<ior_reoo></ior_reoo><ior_reoe></ior_reoe>';
            $xml .= '<ior_hreoo></ior_hreoo><ior_hreoe></ior_hreoe>';
            // Running odds (same as main for live)
            $xml .= '<ior_rouho></ior_rouho><ior_rouhu></ior_rouhu>';
            $xml .= '<ior_rouco></ior_rouco><ior_roucu></ior_roucu>';
            // Result special
            $xml .= '<ior_rshy></ior_rshy><ior_rshn></ior_rshn>';
            $xml .= '<ior_rscy></ior_rscy><ior_rscn></ior_rscn>';
            // Corners
            $xml .= '<ior_rnch></ior_rnch><ior_rncc></ior_rncc>';
            $xml .= '<ior_rnbh></ior_rnbh><ior_rnbc></ior_rnbc>';
            // Over/Under main
            $xml .= '<ior_ouh></ior_ouh><ior_ouc></ior_ouc>';
            // OBT counts
            $xml .= '<r_count>1</r_count>';
            $xml .= '<ou_count>1</ou_count>';
            $xml .= '<cn_count>0</cn_count>';
            $xml .= '<rn_count>0</rn_count>';
            $xml .= '<wi_count>0</wi_count>';
            $xml .= '<et_count>0</et_count>';
            $xml .= '<pk_count>0</pk_count>';
            $xml .= '<pd_count>0</pd_count>';
            $xml .= '<sfs_count>0</sfs_count>';
            $xml .= '<par_minlimit>10</par_minlimit>';
            $xml .= '<showtype>' . $myGame . '</showtype>';
            $xml .= '</game>';
            $xml .= '</ec>';
        }

        $xml .= '</serverresponse>';
        return $xml;
    }

    /**
     * Check if catalog has data
     */
    public function hasCatalog() {
        $file = $this->dataDir . '/catalog.json';
        return file_exists($file) && filesize($file) > 100;
    }
}
