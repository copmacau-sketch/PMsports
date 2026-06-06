-- =====================================================================
-- foot_league registry — single source of truth for league metadata
-- =====================================================================
-- Replaces the hard-coded $LEAGUES array in ingest_odds_api.php and the
-- LID_MIN/MAX + lidToSlug/slugToLid maps in api_v2.php / mysqldb.py.
--
-- Why a registry: Odds-API.io serves ~413 football leagues / ~7400
-- events.  Hard-coded 9-league whitelist forced us to throw away 95%+
-- of upstream coverage.  Promoting LID from compile-time integer
-- constant to DB primary key lets us add a new league with a single
-- INSERT, no code change.
--
-- Backward-compatibility contract (must hold):
--   * Existing 9 lids 101..109 stay PINNED at their current values
--     (bet.gid / foot_match.lid history references them).
--   * AUTO_INCREMENT starts at 200 so newly-discovered leagues never
--     collide with the pinned set.
--   * Application reads `enabled=1` rows; disabled rows stay in DB but
--     don't surface in /api/external/leagues, /events, etc.
--
-- Run on db_sports as root (or any user with CREATE/INSERT).
--   mysql -h 127.0.0.1 -u root -p db_sports < foot_league_schema.sql
-- =====================================================================

USE db_sports;

CREATE TABLE IF NOT EXISTS foot_league (
  lid           INT          AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(128) NOT NULL,
  name_en       VARCHAR(160) NOT NULL,
  name_cn       VARCHAR(160) DEFAULT NULL,
  region        VARCHAR(32)  DEFAULT NULL  COMMENT 'europe / asia / americas / africa / oceania / international',
  country       VARCHAR(64)  DEFAULT NULL  COMMENT 'iso-ish lower-case slug, e.g. england, australia',
  flag          VARCHAR(16)  DEFAULT NULL  COMMENT 'unicode emoji, e.g. 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  apisports_id  INT          DEFAULT NULL  COMMENT 'v3.football.api-sports.io league_id; NULL when api-sports does not cover this league',
  events_count  INT          DEFAULT 0     COMMENT 'most recent /v3/leagues eventsCount snapshot from Odds-API.io',
  priority      INT          DEFAULT 100   COMMENT '1=international top (UCL/WC), 10=top-5 European, 30=major continental, 50=mainstream country, 100=other',
  enabled       TINYINT(1)   DEFAULT 1,
  last_seen_ts  INT          DEFAULT 0     COMMENT 'unix ts of latest /v3/leagues seed; rows that disappear from upstream get last_seen_ts < now-7d sweeped',
  created_ts    INT          DEFAULT 0,
  updated_ts    INT          DEFAULT 0,
  UNIQUE KEY uk_slug (slug),
  KEY idx_region   (region),
  KEY idx_country  (country),
  KEY idx_enabled_priority (enabled, priority, lid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Pin the 9 existing lids (101..109) so historical foot_match rows and
-- bet records keep resolving.  INSERT IGNORE so re-running the script
-- on a server that already has these is a no-op.
-- ---------------------------------------------------------------------
INSERT IGNORE INTO foot_league
  (lid, slug, name_en, name_cn, region, country, flag, apisports_id, priority, created_ts, updated_ts) VALUES
  (101, 'england-premier-league',                    'England - Premier League',     '英超',     'europe',        'england', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 39,  10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (102, 'italy-serie-a',                             'Italy - Serie A',              '意甲',     'europe',        'italy',   '🇮🇹', 135, 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (103, 'spain-laliga',                              'Spain - LaLiga',               '西甲',     'europe',        'spain',   '🇪🇸', 140, 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (104, 'france-ligue-1',                            'France - Ligue 1',             '法甲',     'europe',        'france',  '🇫🇷', 61,  10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (105, 'germany-bundesliga',                        'Germany - Bundesliga',         '德甲',     'europe',        'germany', '🇩🇪', 78,  10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (106, 'international-clubs-uefa-champions-league', 'UEFA Champions League',        '欧冠杯',   'international', 'europe',  '🌍', 2,   1,  UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (107, 'international-clubs-uefa-europa-league',    'UEFA Europa League',           '欧联杯',   'international', 'europe',  '🌍', 3,   1,  UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (108, 'international-world-cup',                   'FIFA World Cup',               '世界杯',   'international', 'world',   '🌍', 1,   1,  UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
  (109, 'china-chinese-super-league',                'China - Super League',         '中超',     'asia',          'china',   '🇨🇳', 169, 5,  UNIX_TIMESTAMP(), UNIX_TIMESTAMP());

-- New leagues discovered by the ingest cron's resolveOrCreate path get
-- lid >= 200 to leave a buffer above the pinned range.
ALTER TABLE foot_league AUTO_INCREMENT = 200;

-- ---------------------------------------------------------------------
-- Sanity:
--   SELECT COUNT(*) FROM foot_league;                              -- 9
--   SELECT lid, slug, priority FROM foot_league ORDER BY priority; -- 1=UCL/UEL/WC, 5=CSL, 10=Top-5
--   SHOW CREATE TABLE foot_league;                                 -- AUTO_INCREMENT=200
-- ---------------------------------------------------------------------
