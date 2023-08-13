import { FC, useEffect, useState } from 'react';
import { Token } from '../services/explorers/explorer.ts';

interface TokensCardProps {
  address: string
  onTokens: Token[]
  explorer: string
}

const TokensCard: FC<TokensCardProps> = ({ address, onTokens, explorer }) => {
  const [tokens, setTokens] = useState<Token[] | undefined>(undefined);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);

  useEffect(() => {
    const fetchTokens = async () => {

      const totalUSD = onTokens.reduce((total, token) => {
        if (token.price !== undefined && token.balance && token.decimals && token.balanceUsd) {
          const balanceUSD = token.balanceUsd;
          return total + balanceUSD;
        }
        return total;
      }, 0);

      setTokens(
        onTokens
          .sort((a, b) => {
            if (a.type === b.type) {
                if (a.balanceUsd === undefined && b.balanceUsd === undefined) return 0;
                if (a.balanceUsd === undefined) return Number(b.balanceUsd);
                if (b.balanceUsd === undefined) return Number(a.balanceUsd);
                return Number(a.balanceUsd) - Number(b.balanceUsd);
            };
            if (a.type === 'ERC-20' && b.type !== 'ERC-20') return -1;
            if (b.type === 'ERC-20' && a.type !== 'ERC-20') return 1;
            return 0;
          })
          .filter((token) => token.name),
      );

      setTotalBalanceUSD(totalUSD);
    };

    fetchTokens();
  }, [address, onTokens]);

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-[245px] overflow-auto scrollbar">
      <div className="block sm:space-x-4 xl:space-x-0 2xl:space-x-4 w-[339px]">
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
          {!tokens && <h1 className="text-center text-2xl text-white">Impossible to load token</h1>}
          {totalBalanceUSD !== 0 && (
            <div className="text-center text-gray-500 dark:text-white mb-4 text-xl">
              Total Balance: ${totalBalanceUSD.toFixed(2)}
            </div>
          )}
          {tokens &&
            tokens.map((token, index) => {
              return (
                <li
                  className={
                    !totalBalanceUSD && !index
                      ? 'pb-3 sm:pb-4'
                      : index === tokens.length - 1
                      ? 'pt-3 sm:pt-4'
                      : 'py-3 sm:pt-4'
                  }
                  key={index}
                >
                  <div
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => {
                      window.open(explorer+ '/address/' + token.contractAddress, '_blank');
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{token.symbol}</p>
                        {token.type === 'ERC-721' && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-blue-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-blue-400">
                            NFT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">{token.name}</p>
                    </div>
                    <div className="inline-flex flex-col items-end text-base font-semibold text-gray-900 dark:text-white">
                      <div>{token.decimals ? (token.balance * 10 ** -token.decimals).toFixed(3) : token.balance}</div>
                      {token.price !== undefined && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ${((token.price || 0) * (token.balance * 10 ** -token.decimals)).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default TokensCard;