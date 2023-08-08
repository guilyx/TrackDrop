import axios, { AxiosResponse } from 'axios';
import ExplorerService, { Transaction, Token, Transfer } from './explorer.ts';

// Specialized Token type for the Base Network
interface BaseNetworkToken {
  token: {
    address: string;
    circulating_market_cap: number | null;
    decimals: number;
    exchange_rate: number | undefined;
    holders: number;
    icon_url: string | null;
    name: string;
    symbol: string;
    total_supply: string;
    type: string;
  };
  token_id: number | null;
  token_instance: string | null;
  value: string;
}

interface BaseNetworkTransfer {
  block_hash: string;
  from: {
    hash: string;
  };
  log_index: string;
  method: string;
  timestamp: string;
  to: {
    hash: string;
  };
  token: {
    address: string;
    circulating_market_cap: any;
    decimals: number | null;
    exchange_rate: number | null;
    holders: string;
    icon_url: any;
    name: string;
    symbol: string;
    total_supply: string;
    type: string;
  };
  total: {
    token_id: string;
  };
  tx_hash: string;
  type: string;
}

interface BaseExplorerTransaction {
  timestamp: string;
  fee: {
    type: string;
    value: string;
  };
  gas_limit: string;
  l1_gas_price: string;
  block: number;
  status: string;
  method: string;
  confirmations: number;
  type: number;
  l1_fee_scalar: string;
  exchange_rate: string;
  to: {
    hash: string;
    implementation_name: string | null;
    is_contract: boolean;
    is_verified: boolean | null;
    name: string | null;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
  };
  tx_burnt_fee: string;
  max_fee_per_gas: string;
  result: string;
  hash: string;
  gas_price: string;
  priority_fee: string;
  base_fee_per_gas: string;
  from: {
    hash: string;
    implementation_name: string | null;
    is_contract: boolean;
    is_verified: boolean | null;
    name: string | null;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
  };
  token_transfers: null | any[]; // Replace with actual type if available
  tx_types: string[];
  l1_gas_used: string;
  gas_used: string;
  created_contract: null | string; // Replace with actual type if available
  position: number;
  nonce: number;
  has_error_in_internal_txs: boolean;
  actions: any[]; // Replace with actual type if available
  l1_fee: string;
  decoded_input: {
    method_call: string;
    method_id: string;
    parameters: {
      name: string;
      type: string;
      value: string;
    }[];
  };
  token_transfers_overflow: null | any[]; // Replace with actual type if available
  raw_input: string;
  value: number;
  max_priority_fee_per_gas: string;
  revert_reason: null | string;
  confirmation_duration: [number, number];
  tx_tag: null | string;
}

class BaseService extends ExplorerService {
  convertToCommonTokens(response: BaseNetworkToken[]): Token[] {
    const commonTokens: Token[] = [];

    // Iterate over the response and convert each specialized token to common format
    for (const specializedToken of response) {
      const commonToken: Token = {
        price: specializedToken.token.exchange_rate,
        balance: Number(specializedToken.value),
        contractAddress: specializedToken.token.address,
        decimals: specializedToken.token.decimals,
        name: specializedToken.token.name,
        symbol: specializedToken.token.symbol,
        type: specializedToken.token.type,
      };
      commonTokens.push(commonToken);
    }

    return commonTokens;
  }

  convertToCommonTransfer(response: BaseNetworkTransfer[]): Transfer[] {
    const commonTransfers: Transfer[] = [];

    for (const specializedTransfer of response) {
      const commonTransfer: Transfer = {
        from: specializedTransfer.from.hash,
        to: specializedTransfer.to.hash,
        transactionHash: specializedTransfer.tx_hash,
        timestamp: specializedTransfer.timestamp,
        amount: specializedTransfer.total.token_id,
        tokenAddress: specializedTransfer.token.address,
        type: specializedTransfer.type,
        fields: null,
        token: {
          l2Address: '',
          l1Address: '',
          symbol: specializedTransfer.token.symbol,
          name: specializedTransfer.token.name,
          decimals: specializedTransfer.token.decimals || 0,
          price: specializedTransfer.token.exchange_rate || 0,
        },
      };
      commonTransfers.push(commonTransfer);
    }

    return commonTransfers;
  }

  convertToCommonTransactions(response: BaseExplorerTransaction[]): Transaction[] {
    const commonTransactions: Transaction[] = [];

    for (const specializedTransaction of response) {
      const commonTransaction: Transaction = {
        hash: specializedTransaction.hash,
        to: specializedTransaction.to.hash,
        from: specializedTransaction.from.hash,
        data: '',
        isL1Originated: specializedTransaction.type === 2,
        fee: specializedTransaction.fee.value,
        receivedAt: specializedTransaction.timestamp,
        transfers: [],
        ethValue: specializedTransaction.value,
      };

      commonTransactions.push(commonTransaction);
    }

    return commonTransactions;
  }

  async getTokenList(address: string): Promise<Token[]> {
    return axios
      .get(`https://base.blockscout.com/api/v2/addresses/${address}/token-balances`)
      .then((res) => {
        return this.convertToCommonTokens(res.data);
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  async getAllTransfers(address: string): Promise<Transfer[]> {
    let url = `https://base.blockscout.com/api/v2/addresses/${address}/token-transfers?type=ERC-20%2CERC-721%2CERC-1155&filter=to%20%7C%20from`;
    const limit = 100;
    let page = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const response: AxiosResponse = await axios.get(url + `&page=${page}&limit=${limit}`);
        if (response.status === 200) {
          let transfers = this.convertToCommonTransfer(response.data.items);

          if (response.data.next_page_params === null) {
            return transfers;
          }
          page = response.data.next_page_params.index;
        } else {
          console.error('Error occurred while retrieving transactions.');
          return [];
        }
      } catch (error) {
        console.error('Error occurred while making the request:', error);
        return [];
      }
    }
    return [];
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
      transaction.ethValue = tokensPrice["ETH"];
      transaction.transfers.forEach((transfer: Transfer) => {
        transfer.token.price = tokensPrice[transfer.token.symbol.toUpperCase()];
      });
      transaction.transfers = transaction.transfers.filter((transfer: Transfer) => transfer.token.price !== undefined);
    });
  }

  async getTransactionsList(address: string): Promise<Transaction[]> {
    let url = `https://base.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from
    `;
    let transactions: Transaction[] = [];
    let page = 1;
    const limit = 100;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const response: AxiosResponse = await axios.get(url + `&page=${page}&limit=${limit}`);
        if (response.status === 200) {
          const filteredTransactions = response.data.items.filter((transaction: any) => {
            return !transaction.hasOwnProperty('emission_reward');
          });

          transactions = this.convertToCommonTransactions(filteredTransactions);
          if (response.data.next_page_params === null) {
            break;
          }
          page = response.data.next_page_params.index;
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

    console.log(transfers.length);
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

export default BaseService;
