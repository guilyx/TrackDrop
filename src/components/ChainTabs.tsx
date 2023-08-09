import React from 'react';

interface TabInfo {
    name: string;
    logo: string;
  }

interface ChainTabsProps {
  selectedTab: string;
  setSelectedTab: (tabName: string) => void;
}

const ChainTabs: React.FC<ChainTabsProps> = ({ selectedTab, setSelectedTab }) => {
  const tabInfo: TabInfo[] = [
    { name: 'zkSync', logo: './chains/zksync.svg' },
    { name: 'Linea', logo: './chains/linea.svg' },
    { name: 'zkEvm', logo: './chains/zkevm.svg' },
    { name: 'Mantle', logo: './chains/mantle.svg' },
    { name: 'StarkNet', logo: './chains/starknet.svg' },
    { name: 'Base', logo: './chains/base.svg' },
    { name: 'Scroll', logo: './chains/scroll.svg' },
  ]; // Updated tab names and logo paths

  const renderTabButton = (tabInfo: TabInfo) => {
    const isSelected = selectedTab === tabInfo.name;

    return (
      <button
        className={`flex items-center rounded-md p-2 ${
          isSelected
            ? 'bg-pink-300 bg-opacity-50 text-white'
            : 'bg-gray-300 bg-opacity-25 text-white'
        }`}
        onClick={() => setSelectedTab(tabInfo.name)}
      >
        <img src={tabInfo.logo} alt="" className="h-6 w-6 mr-2" />
        <span className="text-center">{tabInfo.name}</span>
      </button>
    );
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="flex items-center flex-row space-x-5 mt-5">{tabInfo.map((tab) => renderTabButton(tab))}</div>
    </div>
  );
};

export default ChainTabs;
