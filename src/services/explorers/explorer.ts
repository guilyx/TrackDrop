import axios, { AxiosResponse } from 'axios';
import { getTokenPrice } from '../tokenPrice.ts';
import { setCommonTokenPrice, getCommonTokenPrice, hasCommonTokenPrice } from '../../common/common.ts';

export type TransactionsCache = Map<string, Transaction[]>;
export type TransferCache = Map<string, Transfer[]>;
export type TokenCache = Map<string, Token>;
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
  data: string | null;
  isL1Originated: boolean;
  fee: string;
  receivedAt: string;
  transfers: Transfer[];
  ethValue: number | undefined;
}

abstract class ExplorerService {
  chain_token: Token;
  explorer_url: string;
  logo: string;
  name: string;
  tx_in_progress: Map<string, Promise<Transaction[]>> = new Map();
  tx_cache: TransactionsCache = new Map();
  main_token_in_progress: Map<string, Promise<Token | undefined>> = new Map();
  main_token_cache: TokenCache = new Map();
  transfer_in_progress: Map<string, Promise<Transfer[]>> = new Map();
  transfer_cache: TransferCache = new Map();

  constructor(explorer_url: string, name: string, logo: string, chain_token: Token) {
    this.explorer_url = explorer_url;
    this.logo = logo;
    this.name = name;
    this.chain_token = chain_token;
  }

  setCacheTx(hash: string, tx: Transaction[]): void {
    this.tx_cache.set(hash, tx);
  }

  getCacheTx(hash: string): Transaction[] | undefined {
    return this.tx_cache.get(hash);
  }

  setCacheTf(hash: string, tf: Transfer[]): void {
    this.transfer_cache.set(hash, tf);
  }

  getCacheTf(hash: string): Transfer[] | undefined {
    return this.transfer_cache.get(hash);
  }

  setCacheTk(hash: string, tk: Token): void {
    this.main_token_cache.set(hash, tk);
  }

  getCacheTk(hash: string): Token | undefined {
    return this.main_token_cache.get(hash);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFromBridge(tx: Transaction): boolean {
    tx;
    return false;
  }

  needInternalTx(): boolean {
    return false;
  }

  async throttledApiRequest(url: string): Promise<AxiosResponse> {
    // Add a delay of 1000ms (1 second) before making the API request
    let throttle_ms = 0;
    if (this.name.toLowerCase() === 'linea') throttle_ms = 3500;
    await new Promise((resolve) => setTimeout(resolve, throttle_ms));

    try {
      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error) {
      console.error('Error occurred while making the request:', error);
      throw error;
    }
  }

  async fetchMainToken(address: string): Promise<Token | undefined> {
    const cachedToken = this.getCacheTk(address);
    if (cachedToken !== undefined) {
      return cachedToken;
    }

    if (this.main_token_in_progress.has(address)) {
      const tokenInProgress = this.main_token_in_progress.get(address);
      if (tokenInProgress !== undefined) {
        return tokenInProgress as Promise<Token | undefined>;
      }
    }

    const tokenPromise = this.getMainToken(address);
    this.main_token_in_progress.set(address, tokenPromise);

    // Once the promise resolves, update cache and map
    const token = await tokenPromise;
    this.main_token_in_progress.delete(address); // Remove from in-progress map
    return token;
  }

  async fetchTransactions(address: string): Promise<Transaction[]> {
    const cachedTransactions = this.getCacheTx(address);
    if (cachedTransactions !== undefined) {
      return cachedTransactions as Transaction[]; // Use the appropriate type
    }

    if (this.tx_in_progress.has(address)) {
      const txInProgress = this.tx_in_progress.get(address);
      if (txInProgress !== undefined) {
        return txInProgress as Promise<Transaction[]>;
      }
    }

    const txPromise = this.getTransactionsList(address);
    this.tx_in_progress.set(address, txPromise);

    // Once the promise resolves, update cache and map
    const token = await txPromise;
    this.tx_in_progress.delete(address); // Remove from in-progress map
    return token;
  }

  async fetchTransfers(address: string): Promise<Transfer[]> {
    const cachedTfs = this.getCacheTf(address);
    if (cachedTfs !== undefined) {
      return cachedTfs as Transfer[];
    }

    if (this.transfer_in_progress.has(address)) {
      const tfInProgress = this.transfer_in_progress.get(address);
      if (tfInProgress !== undefined) {
        return tfInProgress as Promise<Transfer[]>;
      }
    }

    const tfPromise = this.getAllTransfers(address);
    this.transfer_in_progress.set(address, tfPromise);

    // Once the promise resolves, update cache and map
    const token = await tfPromise;
    this.transfer_in_progress.delete(address); // Remove from in-progress map
    return token;
  }

  async getMainToken(address: string): Promise<Token | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throw new Error('getMainToken method must be implemented in derived class' + address);
  }

  async getTokenList(address: string): Promise<Token[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throw new Error('getTransactionsList method must be implemented in derived classes.' + address);
  }

  async getAllTransfers(address: string): Promise<Transfer[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throw new Error('getTransactionsList method must be implemented in derived classes.' + address);
  }

  async assignTransferValues(transactions: Transaction[]) {
    const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
      id: 42,
      jsonrpc: '2.0',
      method: 'zks_getTokenPrice',
      params: ['0x0000000000000000000000000000000000000000'],
    });

    setCommonTokenPrice('USDC', 1);
    setCommonTokenPrice('USDT', 1);
    setCommonTokenPrice('ZKUSD', 1);
    setCommonTokenPrice('CEBUSD', 1);
    setCommonTokenPrice('LUSD', 1);
    setCommonTokenPrice('ETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('WETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('stETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('rETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('wstETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('eUSD', 1);
    setCommonTokenPrice('USDR', 1);
    setCommonTokenPrice('lETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('z0WETH', parseInt(ethResponse.data.result));
    setCommonTokenPrice('BUSD', 1);

    const mantlePrice = await getTokenPrice('0x3c3a81e81dc49A522A592e7622A7E711c06bf354');
    if (mantlePrice !== undefined) setCommonTokenPrice('MNT', mantlePrice);

    transactions.forEach(async (transaction: Transaction) => {
      transaction.ethValue = getCommonTokenPrice('ETH');

      for (const transfer of transaction.transfers) {
        if (transfer.token.symbol !== null && transfer.token.symbol !== undefined) {
          if (!hasCommonTokenPrice(transfer.token.symbol.toUpperCase())) {
            const tokenPrice = await getTokenPrice(transfer.tokenAddress);
            if (tokenPrice !== undefined) {
              transfer.token.price = tokenPrice;
            }
          } else {
            transfer.token.price = getCommonTokenPrice(transfer.token.symbol.toUpperCase());
          }
        }
      }

      transaction.transfers = transaction.transfers.filter((transfer: Transfer) => transfer.token.price !== undefined);
    });
  }

  async getTransactionsList(address: string): Promise<Transaction[]> {
    throw new Error('getTransactionsList method must be implemented in derived classes.' + address);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertToCommonTokens(response: any): Token[] {
    throw new Error('convertToCommonTokens method must be implemented in derived classes.' + response);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertToCommonTransaction(response: any): Transaction[] {
    throw new Error('convertToCommonTransaction method must be implemented in derived classes.' + response);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertToCommonTransfer(response: any): Transfer[] {
    throw new Error('convertToCommonTransfer method must be implemented in derived classes.' + response);
  }
}

export default ExplorerService;
