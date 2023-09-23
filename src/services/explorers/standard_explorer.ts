import { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import { getTokenPrice } from '../tokenPrice.ts';

export interface StandardToken {
  balance: number;
  contractAddress: string;
  decimals: number;
  name: string;
  symbol: string;
  type: string;
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
  methodId: string | null;
  isError: '0' | '1';
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: '0' | '1';
  value: string;
}

class StandardExplorerService extends ExplorerService {
  uri: string;
  address: string = '';

  constructor(uri: string, name: string, logo: string, explorer_url: string, chain_token: Token) {
    super(explorer_url, name, logo, chain_token);
    this.uri = uri;
  }

  setAddress(address: string) {
    this.address = address;
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
        type: specializedToken.type,
        balanceUsd: undefined,
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
        data: specializedTransaction.methodId,
        isL1Originated: false, // No L1/L2 distinction in Standard, we use this for bridge
        fee: fee.toString(),
        receivedAt: specializedTransaction.timeStamp,
        transfers: [],
        ethValue: parseInt(specializedTransaction.value),
      };

      commonTransactions.push(commonTransaction);
    }

    return commonTransactions;
  }

  async getTokenList(address: string): Promise<Token[]> {
    const limit = 100;
    let page = 1;
    const tokens: Token[] = [];
    let hasMoreTokens = true;

    while (hasMoreTokens) {
      try {
        const response: AxiosResponse = await this.throttledApiRequest(
          `https://${this.uri}/api?module=account&action=tokenlist&address=${address}&page=${page}&offset=${limit}`,
        );

        if (response.status === 200) {
          const commonTokens = this.convertToCommonTokens(response.data.result);
          tokens.push(...commonTokens);

          if (response.data.result.length < limit) {
            hasMoreTokens = false;
            break;
          }
          page++;
        } else {
          console.error('Error occurred while retrieving tokens.');
          hasMoreTokens = false;
          break;
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        hasMoreTokens = false;
        break;
      }
    }

    return tokens;
  }

  async getAllTransfers(address: string): Promise<Transfer[]> {
    const limit = 100;
    let page = 1;
    const transfers: Transfer[] = [];
    let hasMoreTransfers = true;

    while (hasMoreTransfers) {
      try {
        const response: AxiosResponse = await this.throttledApiRequest(
          `https://${this.uri}/api?module=account&action=tokentx&address=${address}&page=${page}&offset=${limit}`,
        );

        if (response.status === 200) {
          const commonTransfers = this.convertToCommonTransfer(response.data.result);
          for (const ctx of commonTransfers) {
            if (
              ctx.transactionHash !== undefined ||
              ctx.from !== undefined ||
              ctx.to !== undefined ||
              ctx.timestamp !== undefined
            ) {
              transfers.push(ctx);
            }
          }

          if (response.data.result.length < limit) {
            hasMoreTransfers = false;
            break;
          }
          page++;
        } else {
          console.error('Error occurred while retrieving transfers.');
          hasMoreTransfers = false;
          break;
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        hasMoreTransfers = false;
        break;
      }
    }

    return transfers;
  }

  async getTransactionsList(address: string): Promise<Transaction[]> {
    this.setAddress(address);

    const limit = 100;
    let page = 1;
    const transactions: Transaction[] = [];
    let hasMoreTxs = true;
    let hasMoreInternalTxs = true;

    while (hasMoreTxs) {
      try {
        const response: AxiosResponse = await this.throttledApiRequest(
          `https://${this.uri}/api?module=account&action=txlist&address=${address}&page=${page}&offset=${limit}`,
        );

        if (response.status === 200) {
          const commonTransactions = this.convertToCommonTransactions(response.data.result);
          for (const tx of commonTransactions) {
            if (tx.hash !== undefined || tx.from !== undefined || tx.to !== undefined) {
              transactions.push(tx);
            }
          }

          if (response.data.result.length < limit) {
            hasMoreTxs = false;
            break;
          }
          page++;
        } else {
          console.error('Error occurred while retrieving transactions.');
          hasMoreTxs = false;
          break;
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        hasMoreTxs = false;
        break;
      }
    }

    if (this.needInternalTx()) {
      while (hasMoreInternalTxs) {
        try {
          const response: AxiosResponse = await this.throttledApiRequest(
            `https://${this.uri}/api?module=account&action=txlistinternal&address=${address}&page=${page}&offset=${limit}`,
          );

          if (response.status === 200) {
            const commonTransactions = this.convertToCommonTransactions(response.data.result);
            for (const ctx of commonTransactions) {
              if (ctx.fee === 'NaN') ctx.fee = '0';
              if (ctx.hash !== undefined || ctx.from !== undefined || ctx.to !== undefined) {
                transactions.push(ctx);
              }
            }

            if (response.data.result.length < limit) {
              hasMoreInternalTxs = false;
              break;
            }
            page++;
          } else {
            console.error('Error occurred while retrieving transactions.');
            hasMoreInternalTxs = false;
            break;
          }
        } catch (error) {
          console.error('Error occurred while making the request:', error);
          hasMoreInternalTxs = false;
          break;
        }
      }
    }

    const transfers: Transfer[] = await this.getAllTransfers(address);

    transfers.forEach((transfer: Transfer) => {
      if (transfer.token === null) return;
      if (transfer.amount === '' || transfer.amount === undefined) transfer.amount = '0';
      let matched_tx = false;

      transactions.forEach((transaction: Transaction) => {
        if (transaction.hash === transfer.transactionHash) {
          transaction.transfers.push(transfer);
          matched_tx = true;
        }
      });

      if (!matched_tx) {
        const dummy_tx: Transaction = {
          fee: '0',
          data: '',
          ethValue: 0.0,
          from: transfer.from,
          to: transfer.to,
          hash: transfer.transactionHash,
          receivedAt: transfer.timestamp,
          transfers: [transfer],
          isL1Originated: false,
        };
        transactions.push(dummy_tx);
      }
    });

    for (const tx of transactions) {
      if (this.isFromBridge(tx)) {
        tx.isL1Originated = true;
      }

      if (tx.isL1Originated === true && tx.transfers.length === 0) {
        const l1_transfer: Transfer = {
          amount: tx.ethValue?.toString() || '',
          from: tx.from,
          to: tx.to,
          tokenAddress: this.chain_token.contractAddress,
          timestamp: tx.receivedAt,
          transactionHash: tx.hash,
          type: 'StandardTransfer',
          token: {
            decimals: this.chain_token.decimals,
            l1Address: '',
            l2Address: this.chain_token.contractAddress,
            name: this.chain_token.name,
            price: this.chain_token.price,
            symbol: this.chain_token.symbol,
          },
          fields: null,
        };
        tx.transfers = [l1_transfer];
      }
    }

    await this.assignTransferValues(transactions);

    const sortedTransactions = transactions.sort((a, b) => Number(b.receivedAt) - Number(a.receivedAt));
    if (this.name === "nova") console.log(sortedTransactions);
    return sortedTransactions;
  }

  async getMainToken(address: string): Promise<Token | undefined> {
    try {
      const response: AxiosResponse = await this.throttledApiRequest(
        `https://${this.uri}/api?module=account&action=balance&address=${address}`,
      );

      if (response.status === 200) {
        const token: Token = {
          contractAddress: this.chain_token.contractAddress,
          type: this.chain_token.type,
          balance: response.data.result,
          decimals: this.chain_token.decimals,
          name: this.chain_token.name,
          symbol: this.chain_token.symbol,
          price: await getTokenPrice(this.chain_token.contractAddress),
          balanceUsd: undefined,
        };

        if (token.price) token.balanceUsd = token.balance * 10 ** -token.decimals * token.price;
        this.chain_token.balance = token.balance;
        this.chain_token.price = token.price;
        this.chain_token.balanceUsd = token.balanceUsd;

        return token;
      } else {
        console.error('Error occurred while retrieving %s.', this.chain_token.symbol);
      }
    } catch (error) {
      console.error('Error occurred while making the request:', error);
    }
  }
}

export default StandardExplorerService;
