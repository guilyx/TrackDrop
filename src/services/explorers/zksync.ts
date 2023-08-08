import axios, { AxiosResponse } from 'axios';
import ExplorerService, { Transaction, Token, Transfer } from './explorer.ts';

class ZkSyncService extends ExplorerService {
  async getTokenList(address: string): Promise<Token[]> {
    return axios
      .get(`https://zksync2-mainnet.zkscan.io/api?module=account&action=tokenlist&address=${address}`)
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        console.log(err);
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

  async assignTransferValues(transactions: Transaction[]) {
    const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
      id: 42,
      jsonrpc: '2.0',
      method: 'zks_getTokenPrice',
      params: ['0x0000000000000000000000000000000000000000'],
    });

    const tokensPrice: any = {
      USDC: 1,
      USDT: 1,
      ZKUSD: 1,
      CEBUSD: 1,
      LUSD: 1,
      ETH: parseInt(ethResponse.data.result),
    };

    transactions.forEach((transaction: Transaction) => {
      transaction.transfers.forEach((transfer: Transfer) => {
        transfer.token.price = tokensPrice[transfer.token.symbol.toUpperCase()];
      });
      transaction.transfers = transaction.transfers.filter((transfer: Transfer) => transfer.token.price !== undefined);
    });
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

export default ZkSyncService;
