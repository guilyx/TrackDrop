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
