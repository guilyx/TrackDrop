import { FC, useEffect, useState } from 'react';
import { Transaction } from '../services/explorers/explorer.ts';
import { getDateFromTransaction } from '../utils/utils.ts';
import Switch from 'react-switch';

interface VolumeCardProps {
  address: string;
  transactions: Transaction[] | [];
}

const VolumeCard: FC<VolumeCardProps> = ({ address, transactions }) => {
  const [volume, setVolume] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [showBridgeTransactions, setShowBridgeTransactions] = useState(false);

  useEffect(() => {
    setChange(0);
    setVolume(0);
    transactions.forEach((transaction) => {
      // Filter transactions based on showBridgeTransactions
      if (showBridgeTransactions && !transaction.isL1Originated) {
        return;
      }

      const transfers = transaction.transfers.sort(
        (a, b) =>
          parseInt(b.amount) * 10 ** -b.token.decimals * Number(b.token.price) -
          parseInt(a.amount) * 10 ** -a.token.decimals * Number(a.token.price),
      );
      if (transfers.length === 0) return;
      
      const tmpVolume = parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * Number(transfers[0].token.price);
      setVolume((prev) => prev + tmpVolume);
      if (getDateFromTransaction(transaction).getTime() >= new Date().getTime() - 86400 * 7 * 1000) {
        setChange((prev) => prev + tmpVolume);
      }
    });
  }, [address, transactions, showBridgeTransactions]);

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <div className="w-52 max-w-52 text-center flex items-center justify-center">
          <h3 className="text-xl text-gray-900 dark:text-white font-bold">
            Volume {showBridgeTransactions ? '(Bridge)' : '(Total)'}
          </h3>
          <Switch
            className="ml-2"
            checked={showBridgeTransactions}
            onChange={() => setShowBridgeTransactions(!showBridgeTransactions)}
            onColor="#5c86f0"
            offColor="#5c86f0"
            checkedIcon={false}
            uncheckedIcon={false}
            height={18}
            width={36}
          />
        </div>
        <div className="text-center pt-7">
          <h3 className="mb-2 text-5xl font-extrabold text-blue-600">${Math.round(volume)}</h3>
          <div
            className={
              'text-l ' + (!change ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400')
            }
          >
            +${Math.round(change)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">the last 7 days</div>
        </div>
      </div>
    </div>
  );
};

export default VolumeCard;
