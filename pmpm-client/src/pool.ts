import {
  type Address,
  type Hex,
  formatUnits,
  parseUnits,
  encodeFunctionData,
} from 'viem';
import { POOL_ABI, ERC20_ABI } from './abi.ts';
import { USDT_BSC, USDT_DECIMALS } from './config.ts';
import { publicClient } from './chain.ts';

export interface PoolState {
  address: Address;
  numOutcomes: number;
  marketId?: bigint;
  endTime?: bigint;
  resolved?: boolean;
  winningOutcome?: number;
  feeRateBps?: bigint;
  owner?: Address;
  collateral?: Address;
  balance?: bigint;
  prices: bigint[]; // 1e18-normalised probabilities (may be empty if AMM seed is zero)
  pricesFloat: number[];
  failures: string[];
}

const POOL = (address: Address) => ({ address, abi: POOL_ABI } as const);

/** Read all interesting view methods of a pool in a single multicall round. */
export async function readPoolState(address: Address): Promise<PoolState> {
  const calls = [
    { ...POOL(address), functionName: 'numOutcomes' },
    { ...POOL(address), functionName: 'marketId' },
    { ...POOL(address), functionName: 'endTime' },
    { ...POOL(address), functionName: 'resolved' },
    { ...POOL(address), functionName: 'winningOutcome' },
    { ...POOL(address), functionName: 'feeRateBps' },
    { ...POOL(address), functionName: 'owner' },
    { ...POOL(address), functionName: 'collateralToken' },
    { ...POOL(address), functionName: 'balance' },
    { ...POOL(address), functionName: 'prices' },
  ] as const;

  const results = await publicClient.multicall({
    contracts: calls as unknown as Parameters<typeof publicClient.multicall>[0]['contracts'],
    allowFailure: true,
  });

  const failures: string[] = [];
  const rOpt = <T,>(i: number): T | undefined => {
    const x = results[i];
    if (!x || x.status !== 'success') {
      const fn = (calls[i] as { functionName?: string } | undefined)?.functionName ?? `#${i}`;
      failures.push(fn);
      return undefined;
    }
    return x.result as T;
  };

  const numOutcomesRaw = rOpt<number | bigint>(0);
  if (numOutcomesRaw === undefined) {
    throw new Error(`pool ${address} did not respond to numOutcomes() — wrong contract?`);
  }

  let prices = (rOpt<readonly bigint[]>(9) ?? []) as readonly bigint[];
  // Pool.prices() can revert (div-by-zero) on a freshly-seeded pool. Fall back to
  // factory.prices(marketId) — works even when the pool aggregate is in a bad state.
  if (prices.length === 0) {
    const mid = rOpt<bigint>(1);
    if (mid !== undefined) {
      const { FACTORY_ADDRESS } = await import('./config.ts');
      const { FACTORY_ABI } = await import('./abi.ts');
      try {
        prices = (await publicClient.readContract({
          address: FACTORY_ADDRESS,
          abi: FACTORY_ABI,
          functionName: 'prices',
          args: [mid],
        })) as readonly bigint[];
      } catch {
        /* factory.prices() can fail for legacy markets — swallow */
      }
    }
  }
  return {
    address,
    numOutcomes: Number(numOutcomesRaw),
    marketId: optBig(rOpt<bigint>(1)),
    endTime: optBig(rOpt<bigint>(2)),
    resolved: rOpt<boolean>(3),
    winningOutcome: optNum(rOpt<number | bigint>(4)),
    feeRateBps: optBig(rOpt<bigint>(5)),
    owner: rOpt<Address>(6),
    collateral: rOpt<Address>(7),
    balance: optBig(rOpt<bigint>(8)),
    prices: [...prices],
    pricesFloat: prices.map((p) => Number(p) / 1e18),
    failures,
  };
}

function optBig(v: bigint | undefined): bigint | undefined {
  return v === undefined ? undefined : BigInt(v);
}
function optNum(v: number | bigint | undefined): number | undefined {
  return v === undefined ? undefined : Number(v);
}

/** Pure on-chain shares-out estimate for a hypothetical buy. */
export async function quoteBuy(
  pool: Address,
  outcome: number,
  amountUsdt: string | number | bigint,
): Promise<{ amountIn: bigint; sharesOut: bigint; sharesFloat: number; impliedOdds: number }> {
  const amountIn =
    typeof amountUsdt === 'bigint' ? amountUsdt : parseUnits(String(amountUsdt), USDT_DECIMALS);
  const sharesOut = (await publicClient.readContract({
    address: pool,
    abi: POOL_ABI,
    functionName: 'quoteBuy',
    args: [outcome, amountIn],
  })) as bigint;
  const sharesFloat = Number(formatUnits(sharesOut, USDT_DECIMALS));
  const amountFloat = Number(formatUnits(amountIn, USDT_DECIMALS));
  const impliedOdds = amountFloat > 0 ? sharesFloat / amountFloat : 0;
  return { amountIn, sharesOut, sharesFloat, impliedOdds };
}

/**
 * Dry-run a `buy()` call. Does NOT submit a transaction. Reports:
 *   1. user USDT balance + allowance to the pool
 *   2. AMM-quoted sharesOut (and AMM-implied odds)
 *   3. raw call data the wallet would sign (`to`, `data`, `value`)
 *   4. eth_call simulation against latest state (catches reverts / cooldowns / etc.)
 */
export async function simulateBuy(args: {
  pool: Address;
  outcome: number;
  amountUsdt: string | number | bigint;
  user: Address;
  slippageBps?: number; // default 100 = 1%
}): Promise<{
  quote: Awaited<ReturnType<typeof quoteBuy>>;
  minSharesOut: bigint;
  usdtBalance: bigint;
  usdtAllowance: bigint;
  approvalNeeded: bigint;
  callData: Hex;
  simulation: { ok: true; result: bigint } | { ok: false; error: string };
}> {
  const slippageBps = args.slippageBps ?? 100;
  const quote = await quoteBuy(args.pool, args.outcome, args.amountUsdt);
  const minSharesOut = (quote.sharesOut * BigInt(10_000 - slippageBps)) / 10_000n;

  const [usdtBalance, usdtAllowance] = await publicClient.multicall({
    contracts: [
      { address: USDT_BSC, abi: ERC20_ABI, functionName: 'balanceOf', args: [args.user] },
      { address: USDT_BSC, abi: ERC20_ABI, functionName: 'allowance', args: [args.user, args.pool] },
    ],
    allowFailure: false,
  });

  const callData = encodeFunctionData({
    abi: POOL_ABI,
    functionName: 'buy',
    args: [args.outcome, quote.amountIn, minSharesOut],
  });

  let simulation: { ok: true; result: bigint } | { ok: false; error: string };
  try {
    const { result } = await publicClient.simulateContract({
      account: args.user,
      address: args.pool,
      abi: POOL_ABI,
      functionName: 'buy',
      args: [args.outcome, quote.amountIn, minSharesOut],
    });
    simulation = { ok: true, result: result as bigint };
  } catch (err) {
    simulation = { ok: false, error: (err as Error).message };
  }

  return {
    quote,
    minSharesOut,
    usdtBalance: usdtBalance as bigint,
    usdtAllowance: usdtAllowance as bigint,
    approvalNeeded: (usdtAllowance as bigint) >= quote.amountIn ? 0n : quote.amountIn,
    callData,
    simulation,
  };
}

export async function readUserShares(
  pool: Address,
  user: Address,
  numOutcomes: number,
): Promise<bigint[]> {
  // Pool itself doesn't expose per-user per-outcome balances in its bundled ABI,
  // so we fall back to the factory's getUserPositions(user, pool, numOutcomes).
  const { FACTORY_ADDRESS } = await import('./config.ts');
  const { FACTORY_ABI } = await import('./abi.ts');
  return (await publicClient.readContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getUserPositions',
    args: [user, pool, numOutcomes],
  })) as bigint[];
}
