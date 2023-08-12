import axios from 'axios';
import { getTokenPrice } from '../tokenPrice.ts';

export interface Token {
  price: number | undefined;
  balance: number;
  contractAddress: string;
  decimals: number;
  name: string;
  symbol: string;
  type: string;
}

export interface Transfer {
  from: string;
  to: string;
  transactionHash: string;
  timestamp: string;
  amount: string;
  tokenAddress: string;
  type: string;
  fields: null;
  token: {
    l2Address: string;
    l1Address: string;
    symbol: string;
    name: string;
    decimals: number;
    price: number;
  };
}

export interface Transaction {
  hash: string;
  to: string;
  from: string;
  data: string;
  isL1Originated: boolean;
  fee: string;
  receivedAt: string;
  transfers: Transfer[];
  ethValue: number;
}

class ExplorerService {
  async getTokenList(address: string): Promise<Token[]> {
    throw new Error('getTransactionsList method must be implemented in derived classes.');
  }

  async getAllTransfers(address: string): Promise<Transfer[]> {
    throw new Error('getTransactionsList method must be implemented in derived classes.');
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
      WETH: parseInt(ethResponse.data.result),
      lETH: parseInt(ethResponse.data.result),
      z0WETH: parseInt(ethResponse.data.result),
      BUSD: 1,
    };

    transactions.forEach(async (transaction: Transaction) => {
      transaction.ethValue = tokensPrice['ETH'];

      for (const transfer of transaction.transfers) {
        if (!(transfer.token.symbol.toUpperCase() in tokensPrice)) {
          const tokenPrice = await getTokenPrice(transfer.tokenAddress);
          if (tokenPrice !== undefined) {
            transfer.token.price = tokenPrice;
          }
        } else {
          transfer.token.price = tokensPrice[transfer.token.symbol.toUpperCase()];
        }
      }

      transaction.transfers = transaction.transfers.filter((transfer: Transfer) => transfer.token.price !== undefined);
    });
  }

  async getTransactionsList(address: string): Promise<Transaction[]> {
    throw new Error('getTransactionsList method must be implemented in derived classes.');
  }

  convertToCommonTokens(response: any): Token[] {
    throw new Error('convertToCommonTokens method must be implemented in derived classes.');
  }

  convertToCommonTransaction(response: any): Transaction[] {
    throw new Error('convertToCommonTransaction method must be implemented in derived classes.');
  }

  convertToCommonTransfer(response: any): Transfer[] {
    throw new Error('convertToCommonTransfer method must be implemented in derived classes.');
  }
}

export default ExplorerService;
