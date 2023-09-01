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

    const buttonStyle = {
      width: '137px', // You can adjust the width as needed
      borderColor: isSelected ? 'white' : 'transparent', // Add border color
      borderWidth: '2px', // Add border width
    };

    const textStyle = isSelected ? { color: 'rgba(255, 255, 255, 1.0)' } : {};

    return (
      <button
        className={`flex items-center justify-center rounded-md p-2 mx-1 ${
          isSelected
            ? 'text-white font-bold'
            : 'text-gray-700 font-bold hover:text-white transition duration-300 ease-in-out'
        }`}
        style={buttonStyle} // Apply the button style here
        onClick={() => setSelectedTab(tabInfo.name)}
      >
        <img src={tabInfo.logo} alt="" className="h-10 w-10 mr-3 ml-3" />
        <span className="text-center" style={textStyle}>
          {tabInfo.name}
        </span>
      </button>
    );
  };

  const rows: JSX.Element[] = [];
  const maxTabsPerRow = 5;

  for (let i = 0; i < tabInfo.length; i += maxTabsPerRow) {
    const row = tabInfo.slice(i, i + maxTabsPerRow);
    const isLastRow = i + maxTabsPerRow >= tabInfo.length;

    const rowElements = row.map((tab) => (
      <div key={tab.name} className={`mr-4 ${isLastRow ? 'mb-1' : 'mb-5'}`}>
        {renderTabButton(tab)}
      </div>
    ));

    rows.push(
      <div key={i} className="flex items-center flex-row space-x-0.5 ml-2 mr-2">
        {rowElements}
      </div>,
    );
  }

  return (
    <div className="p-4 mb-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 w-[807px] sm:p-6 dark:bg-gray-800">
      {rows}
    </div>
  );
};

export default ChainTabs;
