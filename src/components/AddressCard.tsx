import React, { FC, useState } from 'react';
import { FaClipboard, FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode.react';

interface AddressCardProps {
  address: string;
  explorer: string;
}

const AddressCard: FC<AddressCardProps> = ({ address, explorer }) => {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    setShowQRCode(false);
  };

  const truncatedAddress = `${address.slice(0, 8)}*****${address.slice(-8)}`;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 w-[807px] sm:p-6 dark:bg-gray-800 h-auto flex items-center justify-center relative">
      <span
        onClick={() => window.open(`${explorer}/address/${address}`, '_blank')}
        className="text-xl font-bold text-center text-white cursor-pointer"
      >
        {truncatedAddress}
      </span>
      <button
        onClick={handleCopyToClipboard}
        className="ml-4 text-white cursor-pointer focus:outline-none relative"
        title="Copy address to clipboard"
      >
        <FaClipboard size={20} />
        <span className="absolute text-xs -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
          Copy address to clipboard
        </span>
      </button>
      <button
        onClick={() => setShowQRCode(!showQRCode)}
        className="ml-4 text-white cursor-pointer focus:outline-none relative"
        title="Show QR Code"
      >
        <FaQrcode size={20} />
      </button>
      {copied && <span className="ml-2 text-green-500">Copied!</span>}
      {showQRCode && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
          <div className="relative">
            <div className="bg-white p-2 rounded-md shadow-md inline-block">
              <QRCode value={address} size={120} />
            </div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-white rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
