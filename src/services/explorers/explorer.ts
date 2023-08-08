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
    throw new Error('getTransactionsList method must be implemented in derived classes.');
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
