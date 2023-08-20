import { FC, useEffect, useState } from 'react';
import { getTimeAgo } from '../utils/utils.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

interface SupportCardProps {
  address: string;
}

const SupportCard: FC<SupportCardProps> = ({ address }) => {
  const [data, setData] = useState<any>(null);
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    setShow(!show);
  };

  return (
    <>
      <div
        className="relative mt-1.5 rounded-lg dark:border-gray-700 border border-gray-200 mb-4 ml-4 mr-4 w-[812px] bg-white dark:bg-gray-800 text-center"
        style={{ color: 'white' }}
      >
        <div className="flex justify-between items-center p-3 cursor-pointer" onClick={handleOpen}>
          <h1 className="text-lg font-bold">
            <img className="p-2" src="bmc.svg" alt="" width="150" />
          </h1>
          <div className="pl-3 pr-3">
            {show ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
          </div>
        </div>

        {show && (
          <div className="p-5 pl-10 pr-10 bg-gray-900 rounded-t-lg flex justify-between">
          <div className="text-left flex">
              <p className="mr-2">
                  Support me by sending tokens to this address:
              </p>
              <span 
                  onClick={() => 
                      window.open('https://debank.com/profile/0x07ed706146545d01fa66a3c08ebca8c93a0089e5', '_blank')
                  }
                  className="text-white font-bold cursor-pointer"
              >
                  0x07ed706146545d01fa66a3c08ebca8c93a0089e5
              </span>
          </div>
      </div>
      
        )}
      </div>
    </>
  );
};

export default SupportCard;
