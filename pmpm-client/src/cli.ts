#!/usr/bin/env tsx
import { Command } from 'commander';
import { formatUnits, getAddress, isAddress } from 'viem';
import {
  FACTORY_ADDRESS,
  OPERATOR_ADDRESS,
  USDT_BSC,
  USDT_DECIMALS,
  WORLD_CUP_POOL,
} from './config.ts';
import { publicClient } from './chain.ts';
import { FACTORY_ABI } from './abi.ts';
import {
  getBetHistory,
  getHybridPrices,
  getMarketMeta,
  getNextMarketId,
  getPoolPrices,
  getSpreadConfig,
} from './api.ts';
import { quoteBuy, readPoolState, readUserShares, simulateBuy } from './pool.ts';

const program = new Command();
program.name('pmpm-client').description('Read-only / dry-run audit client for pmpm.uk on BSC');

// --- markets list ---------------------------------------------------------
program
  .command('markets')
  .description('List markets from /api/pool-prices + on-chain pool count')
  .action(async () => {
    const [{ poolMap, factory, chain }, { maxExisting, nextId }] = await Promise.all([
      getPoolPrices(),
      getNextMarketId(),
    ]);
    console.log(`chain=${chain}  factory=${factory}  maxExisting=${maxExisting}  nextId=${nextId}`);

    let poolCount: bigint = 0n;
    try {
      poolCount = (await publicClient.readContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'poolCount',
      })) as bigint;
      console.log(`on-chain poolCount(${FACTORY_ADDRESS}) = ${poolCount}`);
    } catch (e) {
      console.log(`poolCount() unavailable on factory ${FACTORY_ADDRESS} (probably legacy)`);
    }

    const ids = Object.keys(poolMap).sort((a, b) => +a - +b);
    console.log(`\n${ids.length} markets reported by /api/pool-prices:`);
    for (const id of ids) console.log(`  market ${id.padStart(3)}  →  ${poolMap[id]}`);
  });

// --- pool detail ---------------------------------------------------------
program
  .command('pool <address>')
  .description('Read full state of a pool via Multicall3')
  .action(async (address: string) => {
    if (!isAddress(address)) throw new Error(`bad address: ${address}`);
    const a = getAddress(address);
    const s = await readPoolState(a);
    console.log(`pool=${s.address}`);
    console.log(`  marketId=${s.marketId ?? '?'}  numOutcomes=${s.numOutcomes}`);
    if (s.endTime !== undefined) {
      console.log(`  endTime=${s.endTime} (${new Date(Number(s.endTime) * 1000).toISOString()})`);
    }
    console.log(`  resolved=${s.resolved ?? '?'}  winningOutcome=${s.winningOutcome ?? '?'}`);
    console.log(`  feeRateBps=${s.feeRateBps ?? '?'}  owner=${s.owner ?? '?'}  collateral=${s.collateral ?? '?'}`);
    if (s.balance !== undefined) {
      console.log(`  balance=${formatUnits(s.balance, USDT_DECIMALS)} USDT`);
    }
    if (s.pricesFloat.length) {
      console.log(`  prices(): [` + s.pricesFloat.map((p) => p.toFixed(5)).join(', ') + ']');
      const sum = s.pricesFloat.reduce((a, b) => a + b, 0);
      console.log(`  Σ prices = ${sum.toFixed(6)}  (should be ≈ 1.0)`);
    }
    if (s.failures.length) console.log(`  ⚠ unsupported calls: ${s.failures.join(', ')}`);
  });

// --- quote one outcome ----------------------------------------------------
program
  .command('quote <pool> <outcome> <amountUsdt>')
  .description('quoteBuy: chain-AMM shares for a hypothetical stake (no tx)')
  .action(async (pool: string, outcome: string, amountUsdt: string) => {
    if (!isAddress(pool)) throw new Error(`bad pool address: ${pool}`);
    const q = await quoteBuy(getAddress(pool), Number(outcome), amountUsdt);
    console.log(`amountIn = ${formatUnits(q.amountIn, USDT_DECIMALS)} USDT`);
    console.log(`sharesOut = ${q.sharesFloat}  (raw=${q.sharesOut})`);
    console.log(`AMM-implied odds (shares/amount) = ${q.impliedOdds.toFixed(4)}`);
    console.log(`AMM-implied probability             = ${(1 / q.impliedOdds * 100).toFixed(4)}%`);
  });

// --- simulate buy (dry-run, no signing) ----------------------------------
program
  .command('simulate <pool> <outcome> <amountUsdt> <user>')
  .description('Dry-run buy() via eth_call. Reports balance/allowance/slippage and unsigned calldata.')
  .option('-s, --slippage <bps>', 'slippage bps for minSharesOut (default 100 = 1%)', '100')
  .action(async (pool: string, outcome: string, amountUsdt: string, user: string, opts) => {
    if (!isAddress(pool) || !isAddress(user)) throw new Error('bad pool/user');
    const r = await simulateBuy({
      pool: getAddress(pool),
      outcome: Number(outcome),
      amountUsdt,
      user: getAddress(user),
      slippageBps: Number(opts.slippage),
    });
    console.log(`amountIn    = ${formatUnits(r.quote.amountIn, USDT_DECIMALS)} USDT`);
    console.log(`sharesOut   = ${r.quote.sharesFloat}`);
    console.log(`minSharesOut(slippage ${opts.slippage}bps) = ${formatUnits(r.minSharesOut, USDT_DECIMALS)}`);
    console.log(`user USDT balance   = ${formatUnits(r.usdtBalance, USDT_DECIMALS)}`);
    console.log(`user USDT allowance = ${formatUnits(r.usdtAllowance, USDT_DECIMALS)} (to pool)`);
    if (r.approvalNeeded > 0n) {
      console.log(`⚠️  approval needed: ${formatUnits(r.approvalNeeded, USDT_DECIMALS)} USDT`);
    }
    console.log(`USDT token = ${USDT_BSC}`);
    console.log(`calldata   = ${r.callData}`);
    if (r.simulation.ok) {
      console.log(`✅ simulation OK  → returns ${r.simulation.result}`);
    } else {
      console.log(`❌ simulation reverted: ${r.simulation.error}`);
    }
  });

// --- positions ------------------------------------------------------------
program
  .command('positions <user> [pool]')
  .description('Read user shares per outcome (defaults to World Cup pool)')
  .action(async (user: string, pool?: string) => {
    if (!isAddress(user)) throw new Error('bad user');
    const p = getAddress((pool ?? WORLD_CUP_POOL) as `0x${string}`);
    const state = await readPoolState(p);
    const shares = await readUserShares(p, getAddress(user), state.numOutcomes);
    const meta = await getMarketMeta().catch(() => null);
    const labels = state.marketId !== undefined ? pickLabels(meta, state.marketId) : undefined;
    console.log(`user=${user}  pool=${p}  marketId=${state.marketId ?? '?'}`);
    shares.forEach((s, i) => {
      if (s === 0n) return;
      const f = Number(formatUnits(s, USDT_DECIMALS));
      console.log(`  outcome ${i.toString().padStart(2)} ${(labels?.[i] ?? '').padEnd(18)}  shares=${f.toFixed(6)}`);
    });
  });

// --- sanity: compare API hybrid-prices vs on-chain prices() --------------
program
  .command('sanity [marketId]')
  .description('Compare /api/hybrid-prices and /api/pool-prices against on-chain prices() for one market')
  .action(async (marketIdArg?: string) => {
    const marketId = Number(marketIdArg ?? 64);
    const [hybrid, pools, meta] = await Promise.all([
      getHybridPrices() as Promise<Record<string, any>>,
      getPoolPrices(),
      getMarketMeta().catch(() => null),
    ]);
    const pool = pools.poolMap[String(marketId)];
    if (!pool) throw new Error(`marketId ${marketId} not in pool-prices`);
    const state = await readPoolState(pool);
    const labels = pickLabels(meta, BigInt(marketId));
    // Real shape: hybrid.prices[marketId] = { chainProbs, apiProbs, blendedProbs, blendedOdds, userOdds, weightAmm, weightApi, ... }
    const e = (hybrid?.prices ?? {})[String(marketId)] as
      | { chainProbs?: number[]; apiProbs?: number[]; blendedProbs?: number[]; blendedOdds?: number[];
          userOdds?: number[]; weightAmm?: number; weightApi?: number; spreadBps?: number;
          feeRate?: number; poolDepth?: number }
      | undefined;
    console.log(`pool=${pool} marketId=${marketId} numOutcomes=${state.numOutcomes}`);
    console.log(`weightAmm=${e?.weightAmm}  weightApi=${e?.weightApi}  spreadBps=${e?.spreadBps}  feeRate=${e?.feeRate}  poolDepth=${e?.poolDepth}`);
    console.log('\nidx  label              chainAPI   chainRPC   api       blended   blendedOdds  userOdds  |Δchain|');
    for (let i = 0; i < state.numOutcomes; i++) {
      const cA = e?.chainProbs?.[i] ?? NaN;
      const cR = state.pricesFloat[i] ?? NaN;
      const aA = e?.apiProbs?.[i] ?? NaN;
      const bA = e?.blendedProbs?.[i] ?? NaN;
      const oB = e?.blendedOdds?.[i] ?? NaN;
      const oU = e?.userOdds?.[i] ?? NaN;
      const d = Math.abs((cA || 0) - (cR || 0));
      console.log(
        `${i.toString().padStart(3)}  ${(labels?.[i] ?? '').padEnd(18)}  ` +
          `${num(cA)}  ${num(cR)}  ${num(aA)}  ${num(bA)}  ${num(oB)}  ${num(oU)}  ${num(d)}`,
      );
    }
  });

// --- shortfall report -----------------------------------------------------
program
  .command('shortfall <address>')
  .description('Pull bet history and summarise promised vs actual exposure (operator-debt scan)')
  .action(async (address: string) => {
    if (!isAddress(address)) throw new Error('bad address');
    const { bets } = await getBetHistory(getAddress(address));
    let pendingPos = 0; // operator owes user
    let pendingNeg = 0; // user got more shares than promised
    const perMarket = new Map<string, { pos: number; neg: number; count: number }>();
    for (const b of bets) {
      const sf = Number(b.shortfall ?? '0');
      const m = b.market_id;
      const row = perMarket.get(m) ?? { pos: 0, neg: 0, count: 0 };
      row.count++;
      if (sf > 0) { pendingPos += sf; row.pos += sf; } else { pendingNeg += sf; row.neg += sf; }
      perMarket.set(m, row);
    }
    console.log(`bets=${bets.length}`);
    console.log(`Σ shortfall>0 (operator owes user) = ${pendingPos.toFixed(6)} USDT`);
    console.log(`Σ shortfall<0 (user got more)      = ${pendingNeg.toFixed(6)} USDT`);
    console.log('\nper market:');
    for (const [m, r] of [...perMarket.entries()].sort()) {
      console.log(`  market ${m.padStart(3)}  bets=${r.count}  +${r.pos.toFixed(4)} / ${r.neg.toFixed(4)}`);
    }
  });

// --- spread / config ------------------------------------------------------
program.command('config').description('Print spread + step config from API').action(async () => {
  const c = await getSpreadConfig();
  console.log(JSON.stringify(c, null, 2));
});

// --- demo: operator wallet ------------------------------------------------
program.command('operator').description('Show operator wallet & its bet history summary').action(async () => {
  console.log(`operator = ${OPERATOR_ADDRESS}`);
  const { bets } = await getBetHistory(OPERATOR_ADDRESS);
  console.log(`bets recorded = ${bets.length}`);
  for (const b of bets.slice(0, 10)) {
    console.log(
      `  ${b.timestamp}  market ${b.market_id} outcome ${b.outcome}  ` +
        `stake ${b.stake_usdt ?? '?'}  promised_odds ${b.promised_odds ?? '?'}  ` +
        `shortfall ${b.shortfall ?? '?'}  (${b.action})`,
    );
  }
});

// ---- helpers -------------------------------------------------------------
function num(x: number): string {
  if (!Number.isFinite(x)) return '   n/a   ';
  return x.toFixed(5).padStart(9);
}

function pickLabels(meta: unknown, marketId: bigint): string[] | undefined {
  if (!meta) return undefined;
  // Real shape: { [marketIdStr]: { outcomeLabels: string[], title, ... } }
  if (typeof meta === 'object' && !Array.isArray(meta)) {
    const m = (meta as Record<string, { outcomeLabels?: string[] }>)[String(marketId)];
    if (m?.outcomeLabels) return m.outcomeLabels;
  }
  const list: Array<{ id?: number; marketId?: number; outcomeLabels?: string[] }> = Array.isArray(meta)
    ? (meta as any[])
    : ((meta as { markets?: any[] }).markets ?? []);
  const hit = list.find((m) => BigInt(m.id ?? m.marketId ?? 0) === marketId);
  return hit?.outcomeLabels;
}

program.parseAsync(process.argv).catch((e) => {
  console.error('error:', e?.message ?? e);
  process.exit(1);
});
