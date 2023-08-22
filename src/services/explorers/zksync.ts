import axios, { AxiosResponse } from 'axios';
import ExplorerService, { Transaction, Token, Transfer } from './explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { getTokenPrice } from '../tokenPrice.ts';

class ZkSyncExplorerService extends ExplorerService {
  constructor() {
    super('https://explorer.zksync.io', 'zksync', './chains/zksync.svg', ETH_TOKEN);
  }

  async getMainToken(address: string): Promise<Token | undefined> {
    try {
      const response: AxiosResponse = await axios.get(
        `https://zksync2-mainnet.zkscan.io/api?module=account&action=balance&address=${address}`,
      );

      if (response.status === 200) {
        (this.chain_token.balance = response.data.result),
          (this.chain_token.price = await getTokenPrice(this.chain_token.contractAddress));
        if (this.chain_token.price !== undefined) {
          this.chain_token.balanceUsd =
            this.chain_token.balance * 10 ** -this.chain_token.decimals * this.chain_token.price;
        }
        return this.chain_token;
      } else {
        console.error('Error occurred while retrieving %s.', this.chain_token.symbol);
        return undefined;
      }
    } catch (error) {
      console.error('Error occurred while making the request:', error);
      return undefined;
    }
  }

  async getTokenList(address: string): Promise<Token[]> {
    return axios
      .get(`https://zksync2-mainnet.zkscan.io/api?module=account&action=tokenlist&address=${address}`)
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async getAllTransfers(address: string): Promise<Transfer[]> {
    let url = `https://block-explorer-api.mainnet.zksync.io/address/${address}/transfers?limit=100&page=1`;
    const transfers: Transfer[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const response: AxiosResponse = await axios.get(url);
        if (response.status === 200) {
          const data = response.data.items;
          transfers.push(...data);

          if (response.data.links.next === '') break;
          url = 'https://block-explorer-api.mainnet.zksync.io/' + response.data.links.next;
        } else {
          console.error('Error occurred while retrieving transactions.');
          break;
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        break;
      }
    }
    return transfers;
  }

  async getTransactionsList(address: string): Promise<Transaction[]> {
    let url = `https://block-explorer-api.mainnet.zksync.io/transactions?address=${address}&limit=100&page=1`;
    const transactions: Transaction[] = [];

    const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
      id: 42,
      jsonrpc: '2.0',
      method: 'zks_getTokenPrice',
      params: ['0x0000000000000000000000000000000000000000'],
    });

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const response: AxiosResponse = await axios.get(url);
        if (response.status === 200) {
          const data = response.data.items;
          data.forEach((transaction: any) => {
            const { hash, to, from, data, isL1Originated, fee, receivedAt } = transaction;
            transactions.push({
              hash: hash,
              to: to,
              from: from,
              data: data,
              isL1Originated: isL1Originated,
              fee: fee,
              receivedAt: receivedAt,
              transfers: [],
              ethValue: parseInt(ethResponse.data.result),
            });
          });

          if (response.data.links.next === '') break;
          url = 'https://block-explorer-api.mainnet.zksync.io/' + response.data.links.next;
        } else {
          console.error('Error occurred while retrieving transactions.');
          break;
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        break;
      }
    }

    const transfers: Transfer[] = await this.getAllTransfers(address);

    transfers.forEach((transfer: Transfer) => {
      if (transfer.token === null) return;
      transactions.forEach((transaction: Transaction) => {
        if (transaction.hash === transfer.transactionHash) {
          transaction.transfers.push(transfer);
        }
      });
    });

    await this.assignTransferValues(transactions);

    return transactions;
  }
}

export default ZkSyncExplorerService;
