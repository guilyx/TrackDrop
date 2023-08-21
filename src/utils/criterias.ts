import { Transaction } from '../services/explorers/explorer';
import { countAllTransactionPeriods } from './utils';

const hasBridged = (transactions: Transaction[] | []) => {
  if (transactions.length === 0) {
    return false;
  }

  // Filter Bridge Txs ?

  return true;
};

const countDistinctMonths = (address: string, transactions: Transaction[] | []) => {
  const { days, weeks, months } = countAllTransactionPeriods(address, transactions);
  return months;
};

const countTransactions = (transactions: Transaction[] | []) => {
  return transactions.length;
};
