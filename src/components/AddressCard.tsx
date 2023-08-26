import { FC } from 'react';

interface AddressCardProps {
  address: string;
  explorer: string
}

const AddressCard: FC<AddressCardProps> = ({ address, explorer }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 w-[807px] sm:p-6 dark:bg-gray-800 h-auto flex items-center justify-center">
      <span
        onClick={() => window.open(`${explorer}/address/${address}`, '_blank')}
        className="text-xl font-bold text-center text-white cursor-pointer"
      >
        {address}
      </span>
    </div>
  );
};

export default AddressCard;
