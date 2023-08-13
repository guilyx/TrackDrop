import axios from 'axios';
import { getTokenPrice } from '../tokenPrice.ts';
import { setCommonTokenPrice, getCommonTokenPrice, hasCommonTokenPrice } from '../../common/common.ts';

export interface Token {
  price: number | undefined;
  balance: number;
  contractAddress: string;
  decimals: number;
  name: string;
  symbol: string;
  type: string;
  balanceUsd: number | undefined;
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
    price: number | undefined;
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
  ethValue: number | undefined;
}

class ExplorerService {
  explorer_url: string

  constructor(explorer_url: string) {
    this.explorer_url = explorer_url;
  }

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

    setCommonTokenPrice("USDC", 1);
    setCommonTokenPrice("USDT", 1);
    setCommonTokenPrice("ZKUSD", 1);
    setCommonTokenPrice("CEBUSD", 1);
    setCommonTokenPrice("LUSD", 1);
    setCommonTokenPrice("ETH", parseInt(ethResponse.data.result));
    setCommonTokenPrice("WETH", parseInt(ethResponse.data.result));
    setCommonTokenPrice("lETH", parseInt(ethResponse.data.result));
    setCommonTokenPrice("z0WETH", parseInt(ethResponse.data.result));
    setCommonTokenPrice("BUSD", 1);

    transactions.forEach(async (transaction: Transaction) => {
      transaction.ethValue = getCommonTokenPrice('ETH');

      for (const transfer of transaction.transfers) {
        if (!hasCommonTokenPrice(transfer.token.symbol.toUpperCase())) {
          const tokenPrice = await getTokenPrice(transfer.tokenAddress);
          if (tokenPrice !== undefined) {
            transfer.token.price = tokenPrice;
          }
        } else {
          transfer.token.price = getCommonTokenPrice(transfer.token.symbol.toUpperCase());
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
