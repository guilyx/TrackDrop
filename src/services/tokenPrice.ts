import axios from 'axios';

export async function getTokenPrice(contract_hash: string): Promise<number | undefined> {
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
      if (pair.baseToken.address === contract_hash) {
        const tokenPrice = Number(response.data.pairs[0].priceUsd);
        return tokenPrice;
      }
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return undefined;
  }
}
