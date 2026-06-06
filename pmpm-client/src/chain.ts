import { createPublicClient, fallback, http } from 'viem';
import { bsc } from 'viem/chains';
import { MULTICALL3, RPC_URLS } from './config.ts';

// Public read-only client. Uses Multicall3 for batched reads (viem auto-batches when
// `batch: { multicall: true }` and we point chain.contracts.multicall3 at the canonical
// deployment).
export const publicClient = createPublicClient({
  chain: {
    ...bsc,
    contracts: {
      ...bsc.contracts,
      multicall3: { address: MULTICALL3, blockCreated: 0 },
    },
  },
  transport: fallback(RPC_URLS.map((u) => http(u, { timeout: 8_000 }))),
  batch: { multicall: { batchSize: 1024, wait: 16 } },
});

export type PublicClient = typeof publicClient;
