import { PMPM_API_BASE } from './config.ts';

export interface MarketMeta {
  id: number;
  poolAddress: `0x${string}`;
  factoryAddress: `0x${string}`;
  title: string;
  subtitle?: string;
  numOutcomes: number;
  outcomeLabels: string[];
  endDate: string;
  deadlineUnix?: number;
  oddsId?: string;
  feeRate?: number;
  spreadBps?: number;
  stepVol?: number;
  creator?: `0x${string}`;
  status?: string;
  resolved?: boolean;
  winningOutcome?: number;
}

export interface HybridPricesMarket {
  marketId: number;
  poolAddress: `0x${string}`;
  numOutcomes: number;
  chainProbs: number[];
  apiProbs?: number[];
  blendedProbs: number[];
  userOdds: number[];
  weightAmm: number;
  weightApi: number;
  spreadBps?: number;
  feeRate?: number;
  oddsSource?: string;
  updatedAt?: number;
}

async function jget<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PMPM_API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function getMarketMeta(): Promise<MarketMeta[] | { markets: MarketMeta[] }> {
  return jget('/api/market-meta');
}

export async function getHybridPrices(): Promise<unknown> {
  return jget('/api/hybrid-prices');
}

export async function getPoolPrices(): Promise<{
  chain: string;
  factory: `0x${string}`;
  poolMap: Record<string, `0x${string}`>;
  prices?: Record<string, number[]>;
  chainProbs?: Record<string, number[]>;
  blendedProbs?: Record<string, number[]>;
}> {
  return jget('/api/pool-prices');
}

export async function getSpreadConfig(): Promise<{
  baseSpreadBps: number;
  spreadStepBps: number;
  stepVol: number;
  matchStepVols: Record<string, number>;
}> {
  return jget('/api/spread-config');
}

export async function getNextMarketId(): Promise<{ maxExisting: number; nextId: number }> {
  return jget('/api/odds/next-market-id');
}

export async function getPositions(address: `0x${string}`): Promise<unknown> {
  return jget(`/api/positions?address=${address}`);
}

export async function getBetHistory(address: `0x${string}`): Promise<{
  bets: Array<{
    tx_hash: `0x${string}`;
    block_number: number;
    pool_address: `0x${string}`;
    market_id: string;
    outcome: number;
    shares: string;
    amount_usdt: string;
    action: 'buy' | 'sell' | 'redeem';
    timestamp: string;
    promised_odds?: number;
    promised_payout?: string;
    stake_usdt?: string;
    shortfall?: string;
    supplement_status?: 'pending' | 'done' | 'none';
  }>;
}> {
  return jget(`/api/user/bet-history?address=${address}`);
}

export async function getMatchCommission(): Promise<unknown> {
  return jget('/api/match-commission');
}
