// pmpm.uk on-chain + API constants.
// All addresses verified from the deployed frontend bundles + a real eth_call to the
// World-Cup pool on BSC mainnet (chainId 56, endTime 1784487600 = 2026-07-15 14:00 UTC).

import type { Address } from 'viem';

export const BSC_CHAIN_ID = 56 as const;

export const RPC_URLS: readonly string[] = [
  'https://bsc-dataseed.binance.org/',
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed2.defibit.io/',
];

// Universal Multicall3 deployment.
export const MULTICALL3: Address = '0xcA11bde05977b3631167028862bE2a173976CA11';

// BSC mainnet USDT (BEP-20). NOTE: 18 decimals on BSC, NOT 6 like Ethereum L1 USDT.
export const USDT_BSC: Address = '0x55d398326f99059fF775485246999027B3197955';
export const USDT_DECIMALS = 18;

// pmpm.uk market factory (the one used by all current World-Cup-era markets).
// A legacy factory exists for some older markets but is read the same way.
export const FACTORY_ADDRESS: Address = '0x329722bF7c6eC992eC4eE761C2596F149eA86E65';
export const FACTORY_LEGACY: Address = '0x272217ff85cc343f58db980e7af3077f168842cf';

// Public ops/owner wallet. Listed as `creator` on every market and as `owner()` on pools.
export const OPERATOR_ADDRESS: Address = '0x08CccF5F8c4c447Fcd217d10C95E8D25FD4db22C';

// Reference pool: FIFA World Cup Winner 2026 (marketId 64, 48 outcomes).
export const WORLD_CUP_POOL: Address = '0x000AC41a94589D0BBFbf5400766926561505E0d5';

export const PMPM_API_BASE = 'https://pmpm.uk';

// Hybrid pricing weights are returned per-market by /api/hybrid-prices, but for sanity
// the World-Cup market currently uses 1% AMM + 99% Smarkets-API.
