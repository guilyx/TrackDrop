import axios from 'axios';

export type TokenPriceCache = Map<string, number>;

const tokenPriceInProgress: Map<string, Promise<number | undefined>> = new Map();

const cache: TokenPriceCache = new Map();

function setCacheTokenPrice(hash: string, price: number): void {
  cache.set(hash, price);
}

function getCacheTokenPrice(hash: string): number | undefined {
  return cache.get(hash);
}

async function fetchTokenPrice(contract_hash: string): Promise<number | undefined> {
  try {
    const response = await axios.get(`https://api.dexscreener.io/latest/dex/tokens/${contract_hash}`);
    if (response.status != 200) {
      console.error('Request failed:', response.status);
      return undefined;
    }

    if (response.data.pairs === null || response.data.pairs.length === 0) {
      return undefined;
    }

    for (const pair of response.data.pairs) {
      const token = String(pair.baseToken.address).toLowerCase();
      if (token === contract_hash.toLowerCase()) {
        const tokenPrice = Number(pair.priceUsd);
        setCacheTokenPrice(contract_hash, tokenPrice);
        return tokenPrice;
      }
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return undefined;
  }
}

export async function getTokenPrice(contract_hash: string): Promise<number | undefined> {
  const cachedPrice = getCacheTokenPrice(contract_hash);
  if (cachedPrice !== undefined) {
    return cachedPrice;
  }

  if (tokenPriceInProgress.has(contract_hash)) {
    const tokenPromise = tokenPriceInProgress.get(contract_hash);
    if (tokenPromise !== undefined) {
      return tokenPromise as Promise<number | undefined>;
    }
  }

  const pricePromise = fetchTokenPrice(contract_hash);
  tokenPriceInProgress.set(contract_hash, pricePromise);

  // Once the promise resolves, update cache and map
  const price = await pricePromise;
  tokenPriceInProgress.delete(contract_hash); // Remove from in-progress map
  return price;
}
