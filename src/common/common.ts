import { Token } from "../services/explorers/explorer";

const tokenPriceMap: Map<string, number> = new Map();

export function setCommonTokenPrice(symbol: string, price: number) {
  tokenPriceMap.set(symbol, price);
}

export function getCommonTokenPrice(symbol: string): number | undefined {
  return tokenPriceMap.get(symbol);
}

export function hasCommonTokenPrice(symbol: string): boolean {
  return tokenPriceMap.has(symbol);
}

export const MANTLE_TOKEN: Token = {
    contractAddress: '0x3c3a81e81dc49A522A592e7622A7E711c06bf354',
    name: 'Mantle', 
    symbol: 'MNT',
    type: 'ERC-20', 
    decimals: 18,
    price: undefined,
    balance: 0.0,
    balanceUsd: undefined,
}

export const ETH_TOKEN: Token = {
    contractAddress: '0x4200000000000000000000000000000000000006',
    name: 'Ether', 
    symbol: 'ETH',
    type: 'ERC-20', 
    decimals: 18,
    price: undefined,
    balance: 0.0,
    balanceUsd: undefined,
}