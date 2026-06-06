# Design Doc: Phase-Closed Betting & Unified Market Source

**Status**: proposed
**Author**: Cascade (with X)
**Created**: 2026-05-24
**Related code**: `wwwroot_F5PEa/application/member/api_v2.php`, `crown-explorer/backend/app/oddsapi_ws.py`, `crown-explorer/backend/app/ingest_oddsapi.py`

## 1. Motivation

A real production bet (`bet.ID=193`, `ticket=DT20260523073355818`, gid `68995172`, Shanghai
Port FC vs Tianjin Jinmen Tiger, CSL) was placed **33 minutes after kickoff** at
`ML home @ 1.727`. Audit of `api_v2.php` revealed three structural defects that
together allow stale/manipulated prices to settle as valid bets, regardless of
whether the match has gone in-play:

1. **List vs. detail use different sources** — list returns WS-cache (in-play) or
   `r_cn` (pre-match); detail bypasses both and hits `fetchOddsApiMarkets()` (live
   REST). Same `gid` shows different prices on the two surfaces.
2. **No phase boundary** — `mainOddsForRow()` keys off `foot_match.status`,
   which is updated by an async cron. Between kickoff and the next cron tick
   (30 s – 5 min), the pre-match `r_cn` snapshot is still served, and
   `place-bet` accepts the implied price.
3. **`place-bet` has zero price/phase validation** — it accepts whatever
   `event_id / market_id / odds` the client submits.

The goal of this design is to make pre-match and in-play markets **(a) symmetric
in coverage**, **(b) mutually exclusive in time**, and **(c) write-validated** so
no bet can land at a price that is not currently offered by the system.

## 2. Non-goals

- Settling the long-running question of whether `oddsapi.sqlite` (FastAPI ingest)
  or `foot_match_xml.r_cn` (PHP ingest) is the canonical pre-match source.
  Either is fine; this design only requires that **one** is chosen per `lid`.
- Cleaning up the dual REST cron (PHP + Python). Tracked separately.
- UI changes beyond surfacing `phase` and rejecting `phase_transitioned` /
  `odds_changed` errors gracefully.

## 3. Core abstraction: `activeOddsContext($row)`

Single function that every read path **and** the write path consults. It
returns the full market list **plus** the current phase. There is no
"main_odds" projection that lives outside it; that becomes a thin helper that
runs after `activeOddsContext` decides the phase and markets.

```php
function activeOddsContext(array $row): array {
    $phase = computePhase($row);
    if ($phase === 'closed') {
        return ['phase' => 'closed', 'markets' => [], 'ts' => 0];
    }
    $gid = (int)$row['gid'];
    if ($phase === 'inplay') {
        // strict: WS-only, no r_cn / no REST fallback
        $snap = readWsLiveSnapshot($gid);
        if (!$snap || empty($snap['markets'])) {
            return ['phase' => 'inplay', 'markets' => [], 'ts' => 0];
        }
        return [
            'phase'   => 'inplay',
            'markets' => $snap['markets'],
            'ts'      => (int)($snap['updated_at_ts'] ?? time()),
        ];
    }
    // pre-match: r_cn (current PHP source-of-truth)
    return [
        'phase'   => 'pre',
        'markets' => parseRcnMarkets($row['r_cn'] ?? ''),
        'ts'      => time(),
    ];
}
```

### 3.1 Phase computation with hard kickoff guard

```php
function computePhase(array $row): string {
    if ((int)($row['is_inball'] ?? 0) === 1) return 'closed';

    $kickoff = (int)($row['datetime'] ?? 0);
    if ($kickoff <= 0) return 'closed';            // unknown → safe close

    $now    = time();
    $status = (int)($row['status'] ?? 0);

    // Hard guard band: ±5 min around kickoff. If the upstream status flag
    // has not transitioned yet, treat as closed (refuse new bets) rather
    // than allowing pre-match prices to be hit during/after kickoff.
    if ($now >= $kickoff - 300 && $now <= $kickoff + 300 && $status === 0) {
        return 'closed';
    }
    if ($now >= $kickoff || $status === 1) return 'inplay';
    return 'pre';
}
```

**Why ±5 min closed band**: Crown's `is_inball` / `status` flags are written by
`ingest_odds_api.php` cron. Worst-case latency observed is ~3 min. The 5-min
band fully absorbs that, at the cost of refusing the last 5 minutes of
pre-match bets. Acceptable tradeoff.

### 3.2 Invariants

| Invariant | Consequence if violated |
| --- | --- |
| `pre` phase **never** reads `/dev/shm/oddsapi_live` | WS has in-play prices; mixing into pre-match is wrong |
| `inplay` phase **never** reads `r_cn` or calls `fetchOddsApiMarkets()` | `r_cn` is cron-driven (5 min stale); REST bypasses the WS-only contract |
| `closed` phase returns empty markets unconditionally | All downstream paths must handle `markets=[]` |
| `phase` returned by list and detail for the same `gid` at the same time **must match** | Otherwise users see inconsistent UI |

## 4. Read path changes

### 4.1 `/api/external/events?live=true` (list)

Replace per-event branching in the response builder with one call:

```php
$ctx = activeOddsContext($r);
$item = [
    /* ... existing fields ... */
    'phase'        => $ctx['phase'],
    'market_count' => count($ctx['markets']),
    'main_odds'    => $ctx['phase'] === 'closed' ? null : projectMainOdds($ctx['markets']),
];
```

`projectMainOdds(array $markets)` is a pure function that picks the 9–12
canonical inline fields (`m_h, m_n, m_c, re_h, re_line, re_c, ou_over, ou_line,
ou_under, ...`) out of a market list. It is **source-agnostic** — same code path
whether markets came from WS or `r_cn`.

### 4.2 `/api/external/events/{gid}/markets` (detail)

```php
$ctx = activeOddsContext($row);
echo json_encode([
    'event'    => $event,
    'phase'    => $ctx['phase'],
    'markets'  => $ctx['markets'],
    'updated'  => $ctx['ts'],
]);
```

**Removed**: the existing `fetchOddsApiMarkets()` call. The detail endpoint
no longer reaches out to Odds-API.io REST on demand. Side effect: in-play
detail page surface shrinks from ~60 markets (everything upstream offers) to
~10 markets (everything the WS bridge actually receives). This is *correct*:
the system should only display markets it can settle, and the WS bridge is the
sole authority on what's live.

If the product needs the long tail of upstream markets back, the right fix is
to expand the WS subscription, not to dual-source the read path.

## 5. Write path: `/api/pmppm/place-bet`

New validation block inserted between the existing balance check and the
`INSERT INTO bet` (currently `api_v2.php:483-490`):

```php
$gid = (int)($body['event_id'] ?? 0);
$claimedPhase = (string)($body['phase'] ?? '');   // frontend MUST send
if ($gid <= 0 || !in_array($claimedPhase, ['pre', 'inplay'], true)) {
    http_response_code(400);
    echo json_encode(['detail' => 'invalid_request']); exit;
}

// Load just enough to compute context
$stmt = $pdo->prepare(
    "SELECT m.gid, m.status, m.is_inball, m.datetime,
            m.league, m.team_h, m.team_c,
            x.r_cn
     FROM foot_match m
     LEFT JOIN foot_match_xml x ON x.gid = m.gid
     WHERE m.gid = :g LIMIT 1");
$stmt->execute([':g' => $gid]);
$row = $stmt->fetch();
if (!$row) {
    http_response_code(404);
    echo json_encode(['detail' => 'event_not_found']); exit;
}

$ctx = activeOddsContext($row);

// (1) phase agreement
if ($ctx['phase'] !== $claimedPhase) {
    http_response_code(409);
    echo json_encode([
        'detail'   => 'phase_transitioned',
        'expected' => $claimedPhase,
        'current'  => $ctx['phase'],
    ]); exit;
}

// (2) closed / empty
if ($ctx['phase'] === 'closed' || empty($ctx['markets'])) {
    http_response_code(409);
    echo json_encode(['detail' => 'market_closed']); exit;
}

// (3) market line existence + price tolerance
$line = locateMarketLine($ctx['markets'],
    (string)$body['market_id'],
    (string)($body['outcome_field'] ?? ''),
    isset($body['outcome_line']) ? (float)$body['outcome_line'] : null);
if (!$line) {
    http_response_code(409);
    echo json_encode(['detail' => 'market_not_open']); exit;
}
$tolerance = max(0.005, $line['price'] * 0.005);   // 0.5 % or 0.005 absolute
if (abs($line['price'] - $odds) > $tolerance) {
    http_response_code(409);
    echo json_encode([
        'detail'    => 'odds_changed',
        'submitted' => $odds,
        'current'   => $line['price'],
    ]); exit;
}

// ... existing balance UPDATE and INSERT below, with extra `bet_phase` column ...
```

`locateMarketLine($markets, $marketId, $field, $line)`:
- Match by `market_id` first (frontend should always send it).
- Fall back to `(market_name, outcome_field, line)` triple.
- Return `['price' => float, 'market_name' => str, 'outcome' => str]` or null.

## 6. Schema change

```sql
ALTER TABLE db_client.bet
  ADD COLUMN bet_phase ENUM('pre', 'inplay') NOT NULL DEFAULT 'pre' AFTER betstr,
  ADD INDEX idx_bet_phase (bet_phase, bet_time);
```

Backfill: leave historical rows as `'pre'`. The column is meaningful only for
new bets. Settlement code (`settle_bets.php`) needs no change; it's used for
post-hoc audit and risk reports.

## 7. Market coverage parity

Audit of `extractMainOddsFromWsCache()` (in-play) and `parseRcnMarkets()`
(pre-match) reveals asymmetry:

| Market | r_cn (pre) | WS (inplay) |
| --- | --- | --- |
| ML 1X2 | ✅ | ✅ |
| Spread (亚盘) | ✅ | ✅ |
| Totals (大小) | ✅ | ✅ |
| Half-Time ML | ✅ | ✅ |
| Half-Time Spread | ✅ | ✅ |
| Half-Time Totals | ✅ | ✅ |
| Corners Totals | ✅ | ✅ |
| Double Chance | ✅ | ✅ |
| Correct Score | ✅ | ❌ |
| Draw No Bet | ❌ | ✅ |
| BTTS | ❌ | ✅ |
| BTTS HT | ❌ | ✅ |

**Fixes**:

- In `parseRcnMarkets()` add extraction for `ior_NB1/NB2` (DNB),
  `ior_BSY/BSN` (BTTS), `ior_HBSY/HBSN` (BTTS HT) — `ingest_odds_api.php`
  already writes these tags when upstream provides them.
- In `extractMainOddsFromWsCache()` add `Correct Score` extraction (WS
  payload already carries the `<S\d_\d>` equivalent under a `Correct Score`
  market name).

Net effect: 12 canonical markets, symmetric in both phases.

## 8. Rollout plan

| Step | Risk | Done when |
| --- | --- | --- |
| 1. Implement `activeOddsContext` + `computePhase` as new functions, no callers yet | low | unit-tested locally |
| 2. Implement `place-bet` validation block; add `bet_phase` column | low | new bets reject `phase_transitioned` and `odds_changed`; existing bets still settle |
| 3. Frontend (H5 + Next) starts sending `phase` in every place-bet POST | low | both surfaces send `phase` field |
| 4. Switch `/api/external/events` list to call `activeOddsContext` | medium | UI shows same `main_odds` as before for in-play, no regressions |
| 5. Switch `/api/external/events/{gid}/markets` detail to call `activeOddsContext`, drop `fetchOddsApiMarkets()` | medium | in-play detail shows ~10 markets, pre-match unchanged |
| 6. Add missing markets (DNB / BTTS / BTTS HT / CS) for symmetry | low | all 12 markets present in both phases for sample matches |

Step 2 is the critical one — once landed, the headline vulnerability
(stale-price acceptance after kickoff) is closed even before steps 4–6 ship.

## 9. Observability

Add structured `error_log` calls (no PII) so the operator dashboard can chart
rejection causes:

- `place-bet rejected: phase_transitioned expected=pre current=inplay gid=...`
- `place-bet rejected: odds_changed submitted=1.727 current=1.690 gid=...`
- `place-bet rejected: market_not_open gid=... market_id=...`

A spike in `phase_transitioned` indicates frontend caches are too stale;
a spike in `odds_changed` indicates either WS lag or client price tampering.

## 10. Open questions

- Should `closed` phase reject bets with HTTP 409 or 410?  Leaning 409 since
  the resource still exists, just not bookable.
- Should `bet_phase` extend to a third value `'late'` for bets placed in the
  ±5-min guard band (currently those are simply rejected)?  Probably no value;
  guard band is symmetrical to "closed" from the bettor's POV.
- Once #2 lands, the `mainOddsForRow()` function becomes a thin wrapper around
  `activeOddsContext()`. Worth deleting outright after step 5.
