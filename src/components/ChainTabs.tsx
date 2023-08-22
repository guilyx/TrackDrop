import React from 'react';
import { TabInfo } from '../common/common.ts';

interface ChainTabsProps {
  tabInfo: TabInfo[];
  selectedTab: string;
  setSelectedTab: (tabName: string) => void;
}

const ChainTabs: React.FC<ChainTabsProps> = ({ tabInfo, selectedTab, setSelectedTab }) => {
  const renderTabButton = (tabInfo: TabInfo) => {
    const isSelected = selectedTab === tabInfo.name;

    return (
      <button
  className={`flex items-center rounded-md p-2 ${
    isSelected
      ? 'bg-pink-300 bg-opacity-50 text-white'
      : 'bg-gray-300 bg-opacity-25 text-white'
  }`}
  style={{
    backgroundColor: isSelected ? 'rgba(224, 114, 255, 0.6)' : '',
  }}
  onClick={() => setSelectedTab(tabInfo.name)}
>
        <img src={tabInfo.logo} alt="" className="h-6 w-6 mr-2" />
        <span className="text-center">{tabInfo.name}</span>
      </button>
    );
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="flex items-center flex-row space-x-5">{tabInfo.map((tab) => renderTabButton(tab))}</div>
    </div>
  );
};

export default ChainTabs;
