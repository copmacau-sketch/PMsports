<?php
/**
 * OddsApiAdapter — 对接 odds-api.io 和 api-sports.io
 * 提供联赛列表、赛程、赔率、赛果查询
 */
class OddsApiAdapter {

    private $oddsApiKey;
    private $sportsApiKey;
    private $oddsBase = 'https://api.odds-api.io/v3';
    private $sportsBase = 'https://v3.football.api-sports.io';

    // 球种映射: 项目 gtype => odds-api sport slug
    private $sportMap = [
        'ft' => 'football',
        'bk' => 'basketball',
        'tn' => 'tennis',
        'bs' => 'baseball',
        'vb' => 'volleyball',
        'es' => 'esports',
    ];

    public function __construct($oddsKey, $sportsKey) {
        $this->oddsApiKey  = $oddsKey;
        $this->sportsApiKey = $sportsKey;
    }

    /**
     * 获取联赛列表
     */
    public function getLeagues($gtype = 'ft') {
        $sport = $this->sportMap[$gtype] ?? 'football';
        $url = $this->oddsBase . '/leagues?' . http_build_query([
            'apiKey' => $this->oddsApiKey,
            'sport'  => $sport,
            'all'    => 'true',
        ]);
        $data = $this->httpGet($url);
        if (!is_array($data)) return [];
        // 只返回有赛事的联赛
        return array_filter($data, function($l) {
            return ($l['eventsCount'] ?? 0) > 0;
        });
    }

    /**
     * 获取赛程列表
     */
    public function getEvents($gtype = 'ft', $leagueSlug = '', $status = 'pending') {
        $sport = $this->sportMap[$gtype] ?? 'football';
        $params = [
            'apiKey'    => $this->oddsApiKey,
            'sport'     => $sport,
            'status'    => $status,
            'bookmaker' => 'Bet365',
        ];
        if (!empty($leagueSlug)) {
            $params['league'] = $leagueSlug;
        }
        $url = $this->oddsBase . '/events?' . http_build_query($params);
        $data = $this->httpGet($url);
        return is_array($data) ? $data : [];
    }

    /**
     * 获取单场赔率
     */
    public function getOdds($eventId, $bookmaker = 'Bet365') {
        $url = $this->oddsBase . '/odds?' . http_build_query([
            'apiKey'     => $this->oddsApiKey,
            'eventId'    => $eventId,
            'bookmakers' => $bookmaker,
        ]);
        return $this->httpGet($url);
    }

    /**
     * 批量获取赛程+赔率（合并请求，减少延迟）
     */
    public function getEventsWithOdds($gtype = 'ft', $leagueSlug = '') {
        $events = $this->getEvents($gtype, $leagueSlug);
        if (empty($events)) return [];

        // 并发拉赔率（用 curl_multi）
        $mh = curl_multi_init();
        $handles = [];
        foreach ($events as $i => $ev) {
            $eid = is_array($ev) ? ($ev['id'] ?? null) : null;
            if (!$eid) continue;
            $url = $this->oddsBase . '/odds?' . http_build_query([
                'apiKey'     => $this->oddsApiKey,
                'eventId'    => $eid,
                'bookmakers' => 'Bet365',
            ]);
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 10,
                CURLOPT_SSL_VERIFYPEER => false,
            ]);
            curl_multi_add_handle($mh, $ch);
            $handles[$i] = $ch;
        }

        // 执行
        $running = 0;
        do { curl_multi_exec($mh, $running); curl_multi_select($mh); } while ($running > 0);

        // 收集结果
        foreach ($handles as $i => $ch) {
            $resp = curl_multi_getcontent($ch);
            $odds = json_decode($resp, true);
            if (is_array($odds) && isset($odds['bookmakers'])) {
                $events[$i]['odds'] = $odds['bookmakers'];
                $events[$i]['urls'] = $odds['urls'] ?? [];
            }
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
        curl_multi_close($mh);

        return $events;
    }

    /**
     * 获取今天赛果 (api-sports.io)
     */
    public function getTodayResults($date = '') {
        if (empty($date)) $date = date('Y-m-d');
        $url = $this->sportsBase . '/fixtures?' . http_build_query(['date' => $date]);
        return $this->httpGetWithHeader($url, ['x-apisports-key: ' . $this->sportsApiKey]);
    }

    /**
     * 获取指定联赛赛果 (api-sports.io)
     */
    public function getLeagueResults($leagueId, $season = '') {
        if (empty($season)) $season = date('Y');
        $url = $this->sportsBase . '/fixtures?' . http_build_query([
            'league' => $leagueId,
            'season' => $season,
            'last'   => 20,
        ]);
        return $this->httpGetWithHeader($url, ['x-apisports-key: ' . $this->sportsApiKey]);
    }

    /**
     * 获取实时比分 (api-sports.io)
     */
    public function getLiveScores() {
        $url = $this->sportsBase . '/fixtures?live=all';
        return $this->httpGetWithHeader($url, ['x-apisports-key: ' . $this->sportsApiKey]);
    }

    // ---- HTTP helpers ----

    private function httpGet($url) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);
        $resp = curl_exec($ch);
        curl_close($ch);
        return json_decode($resp, true);
    }

    private function httpGetWithHeader($url, $headers) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER     => $headers,
        ]);
        $resp = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($resp, true);
        return $data['response'] ?? [];
    }
}
