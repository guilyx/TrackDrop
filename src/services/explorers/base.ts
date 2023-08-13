import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';
class BaseExplorerService extends StandardExplorerService {
  constructor() {
    super('api.basescan.org', 'base', 'https://base.blockscout.com');
  }

  convertToCommonTokens(response: any): Token[] {
    const commonTokens: Token[] = [];

    for (const specializedToken of response) {
      const commonToken: Token = {
        price: undefined,
        balance: specializedToken.value,
        contractAddress: specializedToken.token.address,
        decimals: specializedToken.token.decimals,
        name: specializedToken.token.name,
        symbol: specializedToken.token.symbol,
        type: specializedToken.token.type,
        balanceUsd: undefined,
      };
      commonTokens.push(commonToken);
    }

    return commonTokens;
  }

  async getTokenList(address: string): Promise<Token[]> {
    const limit = 100;
    let page = 1;
    const tokens: Token[] = [];

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://base.blockscout.com/api/v2/addresses/${address}/token-balances?page=${page}&limit=${limit}`,
        );

        if (response.status === 200) {
          const commonTokens = this.convertToCommonTokens(response.data);
          tokens.push(...commonTokens);

          if (response.data.length < limit) {
            break;
          }
          page++;
        } else {
          console.error('Error occurred while retrieving tokens.');
          break;
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        break;
      }
    }

    try {
      const response: AxiosResponse = await axios.get(
        `https://api.basescan.org/api?module=account&action=balance&address=${address}`,
      );

      if (response.status === 200) {
        const eth_token: Token = {
          balance: response.data.result,
          contractAddress: "0x4200000000000000000000000000000000000006",
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
          type: "ERC-20",
          price: undefined,
        }
        tokens.push(eth_token);
      } else {
        console.error('Error occurred while retrieving ETH.');
      }
    } catch (error) {
      console.error('Error occurred while making the request:', error);
    }

    return tokens;
  }
}

export default BaseExplorerService;
