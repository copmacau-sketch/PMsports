# pmpm-client

Read-only / dry-run audit client for **pmpm.uk** — a BSC-deployed prediction-market AMM
(USDT-collateralised) that displays Smarkets-blended odds but settles on raw CPMM curves.

> ⚠️ This client never signs or broadcasts transactions. `simulate buy` only runs
> `eth_call` against a public BSC node. Real betting requires a wallet UI; we deliberately
> omit private-key support to avoid being weaponised.

## Layout

```
src/
  config.ts   addresses, RPCs, USDT decimals (18 on BSC!)
  abi.ts      Pool / Factory / Router / ERC20 ABIs (reversed from frontend bundles)
  chain.ts    viem PublicClient with Multicall3 batching + RPC fallbacks
  api.ts      typed fetchers for /api/* on pmpm.uk
  pool.ts     readPoolState, quoteBuy, simulateBuy, readUserShares
  cli.ts      commander-based CLI
```

## Install

```bash
cd pmpm-client
npm install      # or pnpm install / bun install
npm run typecheck
```

Requires Node ≥ 20 (uses global `fetch`).

## Commands

```bash
# 1. list every market (poolMap) and on-chain pool count
npm run cli -- markets

# 2. read a pool's full state via Multicall3
npm run cli -- pool 0x000AC41a94589D0BBFbf5400766926561505E0d5    # World Cup Winner

# 3. ask the AMM what you'd get for X USDT on outcome N (read-only)
npm run cli -- quote 0x000AC41a94589D0BBFbf5400766926561505E0d5 0 1     # 1 USDT on Spain

# 4. dry-run buy() via eth_call (no signing, no broadcast)
npm run cli -- simulate \
    0x000AC41a94589D0BBFbf5400766926561505E0d5 0 1 \
    0x08CccF5F8c4c447Fcd217d10C95E8D25FD4db22C -s 100

# 5. show user shares per outcome
npm run cli -- positions 0x08CccF5F8c4c447Fcd217d10C95E8D25FD4db22C
npm run cli -- positions 0x08CccF5F8c4c447Fcd217d10C95E8D25FD4db22C \
    0x000AC41a94589D0BBFbf5400766926561505E0d5

# 6. compare what /api/hybrid-prices claims vs what pool.prices() actually returns
npm run cli -- sanity 64       # World Cup
npm run cli -- sanity 77       # EPL outright

# 7. promised vs actual delta for one wallet (operator-debt scan)
npm run cli -- shortfall 0x08CccF5F8c4c447Fcd217d10C95E8D25FD4db22C

# 8. misc
npm run cli -- config
npm run cli -- operator
```

## What this is good for

- **Sanity-check** that the hybrid-prices API blending matches `chainProbs * weightAmm + apiProbs * weightApi` to the bps.
- **Quote arb**: how far off is the displayed Smarkets-blended odds from what `pool.quoteBuy()` actually mints? (Currently large — the AMM only carries ~1% pricing weight.)
- **Operator exposure**: sum the `shortfall` field on every recorded bet to estimate the off-chain "supplement" liability pmpm owes its punters.
- **Dry-run a bet** to see the exact calldata + revert reason without spending gas.

## Verified facts at time of writing

- chainId 56 (BSC mainnet), confirmed via `eth_chainId`.
- World Cup pool `0x000AC41a…` is deployed; `endTime() = 1784487600` (2026-07-15 14:00 UTC).
- Factory `0x329722bF…` mints all current World Cup-era pools; legacy factory `0x272217ff…` mints earlier markets.
- USDT collateral = `0x55d398326f99059fF775485246999027B3197955` (BEP-20, 18 decimals).
- Operator / `owner()` = `0x08CccF5F8c4c447Fcd217d10C95E8D25FD4db22C` (the same address listed as `creator` for every market and the only wallet observed depositing liquidity).
- World Cup hybrid weights: `weightAmm = 0.01`, `weightApi = 0.99` (Smarkets event `35474876`).
