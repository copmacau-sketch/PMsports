import { parseAbi } from 'viem';

export const ERC20_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address,address) view returns (uint256)',
  'function approve(address,uint256) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);

export const POOL_ABI = parseAbi([
  'function numOutcomes() view returns (uint8)',
  'function marketId() view returns (uint256)',
  'function endTime() view returns (uint256)',
  'function resolved() view returns (bool)',
  'function winningOutcome() view returns (uint8)',
  'function feeRateBps() view returns (uint256)',
  'function collateralToken() view returns (address)',
  'function usdt() view returns (address)',
  'function balance() view returns (uint256)',
  'function owner() view returns (address)',
  'function prices() view returns (uint256[])',
  'function quoteBuy(uint8 outcome, uint256 amount) view returns (uint256)',
  'function operators(address) view returns (bool)',
  'function authorisedRouters(address) view returns (bool)',
  'function buy(uint8 outcome, uint256 amount, uint256 minSharesOut) returns (uint256)',
  'function sell(uint8 outcome, uint256 shares, uint256 minAmountOut) returns (uint256)',
  'function deposit(uint256 amount)',
  'function setRouter(address router, bool status)',
]);

export const FACTORY_ABI = parseAbi([
  'struct MarketInfo { uint256 id; uint8 numOutcomes; uint256 totalLiquidity; uint256 endTime; bool resolved; uint8 winningOutcome; }',
  'function poolCount() view returns (uint256)',
  'function pools(uint256) view returns (address)',
  'function poolById(uint256 marketId) view returns (address)',
  'function allPools() view returns (address[])',
  'function getMarket(uint256 marketId) view returns (MarketInfo)',
  'function prices(uint256 marketId) view returns (uint256[])',
  'function quoteBuy(uint256 marketId, uint8 outcome, uint256 amount) view returns (uint256)',
  'function allPositions(address user) view returns (uint256[])',
  'function allPositions(uint256 marketId, address user) view returns (uint256[])',
  'function poolPayout(address pool) view returns (uint256)',
  'function poolRedeemed(address pool) view returns (bool)',
  'function getCoolingRemaining(address user, address pool, uint8 outcome) view returns (uint256)',
  'function userShares(address user, address pool, uint8 outcome) view returns (uint256)',
  'function getUserPositions(address user, address pool, uint8 numOutcomes) view returns (uint256[])',
]);

export const ROUTER_ABI = parseAbi([
  'function sell(address pool, uint8 outcome, uint256 shares, uint256 minAmountOut) returns (uint256)',
]);
