import StandardExplorerService from './standard_explorer.ts';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Token } from './explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
class BaseExplorerService extends StandardExplorerService {
  constructor() {
    super('api.basescan.org', 'base', './chains/base.svg', 'https://base.blockscout.com', ETH_TOKEN);
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
          `https://base.blockscout.com/api/v2/addresses/${address}/token-balances?page=${page}&offset=${limit}`,
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

    const main_token = await this.getMainToken(address);
    if (main_token) tokens.push(main_token);

    return tokens;
  }

  isFromBridge(tx: Transaction): boolean {
    if (!tx.from) return false;
    if (tx.from === tx.to && (tx.data === '0x' || tx.data === '0x01')) {
      return true;
    }
    return false;
  }
}

export default BaseExplorerService;
