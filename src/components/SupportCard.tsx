import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FaClipboard, FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode.react';

interface SupportCardProps {
  address: string;
}

const SupportCard: FC<SupportCardProps> = ({ address }) => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleOpen = () => {
    setShow(!show);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    setShowQRCode(false);
  };

  const truncatedAddress = `${address.slice(0, 8)}*****${address.slice(-8)}`;

  return (
    <>
      <div
        className="relative mt-1.5 rounded-lg dark:border-gray-700 border border-gray-200 mb-4 ml-4 mr-4 w-[807px] bg-white dark:bg-gray-800 text-center"
        style={{ color: 'white' }}
      >
        <div className="flex justify-between items-center p-3 cursor-pointer" onClick={handleOpen}>
          <h1 className="text-lg font-bold">
            <img className="p-2" src="bmc-light.svg" alt="" width="200" />
          </h1>
          <div className="pl-3 pr-3">
            {show ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
          </div>
        </div>

        {show && (
          <div className="p-5 pl-10 pr-10 bg-gray-900 rounded-t-lg flex justify-between">
            <div className="text-center flex items-center">
              <p className="text-white">
                Support me by sending tokens to this address:
              </p>
              <span
                onClick={() =>
                  window.open('https://debank.com/profile/0x07ed706146545d01fa66a3c08ebca8c93a0089e5', '_blank')
                }
                className="text-white font-bold cursor-pointer ml-2"
              >
                {truncatedAddress}
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleCopyToClipboard}
                className="text-white cursor-pointer focus:outline-none mr-4"
                title="Copy address to clipboard"
              >
                <FaClipboard size={20} />
                {copied && <span className="ml-2 text-green-500">Copied!</span>}
              </button>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="text-white cursor-pointer focus:outline-none"
                title="Show QR Code"
              >
                <FaQrcode size={20} />
              </button>
              {showQRCode && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                  <div className="bg-white p-2 rounded-md shadow-md inline-block">
                    <QRCode value={address} size={120} />
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-white rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupportCard;
