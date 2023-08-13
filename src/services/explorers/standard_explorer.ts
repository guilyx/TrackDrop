import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';

export interface StandardToken {
  balance: number;
  contractAddress: string;
  decimals: number;
  name: string;
  symbol: string;
}

export interface StandardTokenTransfer {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: number;
  tokenID: number;
  tokenIDs: number[];
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: string;
  values: string[];
}
export interface StandardTransaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: '0' | '1';
  nonce: string;
  timestamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: '0' | '1';
  value: string;
}

class StandardExplorerService extends ExplorerService {
  uri: string;
  name: string;

  constructor(uri: string, name: string, explorer_url: string) {
    super(explorer_url);
    this.uri = uri;
    this.name = name;
  }

  convertToCommonTokens(response: StandardToken[]): Token[] {
    const commonTokens: Token[] = [];

    for (const specializedToken of response) {
      const commonToken: Token = {
        price: undefined,
        balance: specializedToken.balance,
        contractAddress: specializedToken.contractAddress,
        decimals: specializedToken.decimals,
        name: specializedToken.name,
        symbol: specializedToken.symbol,
        type: 'Standard',
      };
      commonTokens.push(commonToken);
    }

    return commonTokens;
  }

  convertToCommonTransfer(response: StandardTokenTransfer[]): Transfer[] {
    const commonTransfers: Transfer[] = [];

    for (const specializedTransfer of response) {
      const commonTransfer: Transfer = {
        from: specializedTransfer.from,
        to: specializedTransfer.to,
        transactionHash: specializedTransfer.hash,
        timestamp: specializedTransfer.timeStamp,
        amount: specializedTransfer.value,
        tokenAddress: specializedTransfer.contractAddress,
        type: 'StandardTransfer',
        fields: null,
        token: {
          l2Address: '',
          l1Address: '',
          symbol: specializedTransfer.tokenSymbol,
          name: specializedTransfer.tokenName,
          decimals: specializedTransfer.tokenDecimal,
          price: 0, // Price information is not provided
        },
      };
      commonTransfers.push(commonTransfer);
    }

    return commonTransfers;
  }

  convertToCommonTransactions(response: StandardTransaction[]): Transaction[] {
    const commonTransactions: Transaction[] = [];

    for (const specializedTransaction of response) {
      const gas_price = Number(specializedTransaction.gasPrice);
      const gas = Number(specializedTransaction.gasUsed);
      const fee = gas * gas_price;
      const commonTransaction: Transaction = {
        hash: specializedTransaction.hash,
        to: specializedTransaction.to,
        from: specializedTransaction.from,
        data: '',
        isL1Originated: false, // No L1/L2 distinction in Standard
        fee: fee.toString(),
        receivedAt: specializedTransaction.timeStamp,
        transfers: [],
        ethValue: 0,
      };

      commonTransactions.push(commonTransaction);
    }

    return commonTransactions;
  }

  async getTokenList(address: string): Promise<Token[]> {
    const limit = 100;
    let page = 1;
    const tokens: Token[] = [];

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://${this.uri}/api?module=account&action=tokenlist&address=${address}&page=${page}&offset=${limit}`,
        );

        if (response.status === 200) {
          const commonTokens = this.convertToCommonTokens(response.data.result);
          tokens.push(...commonTokens);

          if (response.data.result.length < limit) {
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

    console.log(tokens);

    return tokens;
  }

  async getAllTransfers(address: string): Promise<Transfer[]> {
    const limit = 100;
    let page = 1;
    const transfers: Transfer[] = [];

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://${this.uri}/api?module=account&action=tokentx&address=${address}&page=${page}&offset=${limit}`,
        );

        if (response.status === 200) {
          const commonTransfers = this.convertToCommonTransfer(response.data.result);
          transfers.push(...commonTransfers);

          if (response.data.result.length < limit) {
            break;
          }
          page++;
        } else {
          console.error('Error occurred while retrieving transfers.');
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
    const limit = 100;
    let page = 1;
    const transactions: Transaction[] = [];

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://${this.uri}/api?module=account&action=txlist&address=${address}&page=${page}&offset=${limit}`,
        );

        if (response.status === 200) {
          const commonTransactions = this.convertToCommonTransactions(response.data.result);
          transactions.push(...commonTransactions);

          if (response.data.result.length < limit) {
            break;
          }
          page++;
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

export default StandardExplorerService;
