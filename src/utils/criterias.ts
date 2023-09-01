import { Transaction } from '../services/explorers/explorer';
import { countAllTransactionPeriods } from './utils';

const hasBridged = (transactions: Transaction[] | []) => {
  if (transactions.length === 0) {
    return false;
  }

  for (const tx of transactions) {
    if (tx.isL1Originated === true) return true;
  }

  return false;
};

const amountBridged = (transactions: Transaction[] | []) => {
  if (transactions.length === 0) {
    return 0.0;
  }

  // Filter Bridge Txs ?

  return 2000;
};

const countDistinctMonths = (address: string, transactions: Transaction[] | []) => {
  const { days, weeks, months } = countAllTransactionPeriods(address, transactions);
  return months;
};

const countTransactions = (transactions: Transaction[] | []) => {
  return transactions.length;
};

const getVolume = (transactions: Transaction[] | [], bridge_only: boolean) => {
  let volume = 0.0;
  transactions.forEach((transaction) => {
    if (bridge_only && !transaction.isL1Originated) return;

    // For all transfers in transaction.transfer, print amount
    // Highly likely that it fucks up bc tokens have no price tho
    // Move on to new chain until fixed
    const transfers = transaction.transfers.sort(
      (a, b) =>
        parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
        parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
    );
    if (transfers.length === 0) return;

    const tmpVolume = parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
    volume += tmpVolume;
  });
  return volume;
};

const getAirdropTasks = (address: string, chain_name: string, transactions: Transaction[]) => {
  const hasBridgedResult = hasBridged(transactions);
  const months = countDistinctMonths(address, transactions);
  const txs = countTransactions(transactions);
  const volume = getVolume(transactions, false);
  const bridge_volume = getVolume(transactions, true);

  const tasks = [
    {
      name: `Bridged to ${chain_name}`,
      subtasks: [
        {
          name: `You have bridged funds into ${chain_name}`,
          completed: hasBridgedResult,
        },
      ],
    },
    {
      name: 'Transactions over Time',
      subtasks: [
        {
          name: `You've conducted transactions during 2 distinct months`,
          completed: months > 1,
        },
        {
          name: `You've conducted transactions during 6 distinct months`,
          completed: months > 5,
        },
        {
          name: `You've conducted transactions during 9 distinct months`,
          completed: months > 8,
        },
      ],
    },
    {
      name: 'Transaction Frequency and Interaction',
      subtasks: [
        {
          name: `You’ve conducted more than 4 transactions OR interacted with more than 4 smart contracts`,
          completed: txs > 4,
        },
        {
          name: `You’ve conducted more than 10 transactions OR interacted with more than 10 smart contracts`,
          completed: txs > 10,
        },
        {
          name: `You’ve conducted more than 25 transactions OR interacted with more than 25 smart contracts`,
          completed: txs > 25,
        },
        {
          name: `You’ve conducted more than 100 transactions OR interacted with more than 100 smart contracts`,
          completed: txs > 100,
        },
      ],
    },
    {
      name: 'Transaction Value',
      subtasks: [
        {
          name: `You’ve conducted transactions with more than $10,000 in aggregate value`,
          completed: volume > 10000,
        },
        {
          name: `You’ve conducted transactions with more than $50,000 in aggregate value`,
          completed: volume > 50000,
        },
        {
          name: `You’ve conducted transactions with more than $250,000 in aggregate value`,
          completed: volume > 250000,
        },
      ],
    },
    {
      name: `Assets Bridged to ${chain_name}`,
      subtasks: [
        {
          name: `You’ve deposited more than $10,000 of assets`,
          completed: bridge_volume > 10000,
        },
        {
          name: `You’ve deposited more than $50,000 of assets`,
          completed: bridge_volume > 50000,
        },
        {
          name: `You’ve deposited more than $250,000 of assets`,
          completed: bridge_volume > 250000,
        },
      ],
    },
  ];

  return tasks;
};

export { getAirdropTasks };
