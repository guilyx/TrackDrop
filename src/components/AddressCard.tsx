import { FC } from 'react';

interface AddressCardProps {
  address: string;
}

const AddressCard: FC<AddressCardProps> = ({ address }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 w-[807px] sm:p-6 dark:bg-gray-800 h-auto flex items-center justify-center">
      <p className="text-xl font-bold text-center text-white">{address}</p>
    </div>
  );
};

export default AddressCard;