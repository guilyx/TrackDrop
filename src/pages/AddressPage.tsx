import { useEffect, useState } from 'react';
import Header from '../components/Header.tsx'; // Update the path accordingly
import ChainTabs from '../components/ChainTabs.tsx'; // Update the path accordingly

import { Transaction, Token } from '../services/explorers/explorer.ts'

import ExplorerService from '../services/explorers/explorer.ts';

import InteractionsCard from '../components/InteractionsCard.tsx'; // Update the path accordingly
import FeeCard from '../components/FeeCard.tsx';
import VolumeCard from '../components/VolumeCard.tsx';
import BalanceCard from '../components/BalanceCard.tsx';
import ActivityCard from '../components/ActivityCard.tsx';
import SupportCard from '../components/SupportCard.tsx';
import { getTokenPrice } from '../services/tokenPrice.ts';

import MantleExplorerService from '../services/explorers/mantle.ts';
import TaikoExplorerService from '../services/explorers/taiko.ts';
import ScrollExplorerService from '../services/explorers/scroll.ts';
import BaseExplorerService from '../services/explorers/base.ts';
import ZkEvmExplorerService from '../services/explorers/zkevm.ts';
import ZkSyncExplorerService from '../services/explorers/zksync.ts'; // Import the appropriate services
import LineaExplorerService from '../services/explorers/linea.ts';

const AddressPage = () => {
  const address = window.location.search.split('=')[1];

  const zkSyncService = new ZkSyncExplorerService();
  const zkEvmService = new ZkEvmExplorerService();
  const baseService = new BaseExplorerService();
  const lineaService = new LineaExplorerService();
  const mantleService = new MantleExplorerService();
  const taikoService = new TaikoExplorerService();
  const scrollService = new ScrollExplorerService();

  const availableExplorers: Map<string, ExplorerService> = new Map();
  availableExplorers.set('zkSync', zkSyncService);
  availableExplorers.set('zkEvm', zkEvmService);
  availableExplorers.set('Base', baseService);
  availableExplorers.set('Linea', lineaService);
  availableExplorers.set('Mantle', mantleService);
  availableExplorers.set("Scroll (TN)", scrollService);
  availableExplorers.set("Taiko (TN)", taikoService);


  const [selectedTab, setSelectedTab] = useState('');
  const [transactionLists, setTransactionLists] = useState<Record<string, Transaction[]>>({});
  const [tokenList, setTokenList] = useState<Record<string, Token[]>>({});


  useEffect(() => {
    if (!address || address.length !== 42 || address.slice(0, 2) !== '0x') {
      window.location.search = '';
      return;
    }
    fetchAddressInformations();
  }, [address]);

  const fetchAddressInformations = async () => {
    const newTransactionLists: Record<string, Transaction[]> = {};
    const newTokenList: Record<string, Token[]> = {};
    for (const [tabName, service] of availableExplorers) {
      const main_token = await service.fetchMainToken(address);
      const transactions = await service.fetchTransactions(address);

      newTokenList[tabName] = [];
      newTransactionLists[tabName] = transactions;
      
  
      // Merge main_token into existing list or create a new one
      if (main_token) {
        newTokenList[tabName].push(main_token);
      }
    }
    setTokenList(newTokenList);
    setTransactionLists(newTransactionLists);
  };

  const renderSelectedTabContent = () => {
    if (selectedTab == '') {
      return <div>No blockchain service selected.</div>;
    }

    if (!availableExplorers.has(selectedTab)) {
      return <div>Support for {selectedTab} coming soon!</div>;
    }

    const selectedTransactions = transactionLists[selectedTab] || [];
    const tokens = tokenList[selectedTab] || [];
    let maybe_explorer = availableExplorers.get(selectedTab)?.explorer_url;
    const explorer: string = maybe_explorer !== undefined ? maybe_explorer : '';
    
    return (
      <div className="grid place-items-center">
        <div className="flex items-center flex-row space-x-4">
          <InteractionsCard address={address} transactions={selectedTransactions} />
          <VolumeCard address={address} transactions={selectedTransactions} />
          <FeeCard address={address} transactions={selectedTransactions} />
        </div>
        <div className="flex items-center flex-row space-x-5 mt-1.5">
          <SupportCard address="0x07eD706146545d01Fa66A3C08ebCa8C93a0089E5"/>
        </div>
        <div className="flex items-center flex-row space-x-5 mt-1.5">
          <BalanceCard address={address} onTokens={tokens} explorer={explorer}/>
          <ActivityCard address={address} transactions={selectedTransactions} />
        </div>
      </div>
    );
  };

  return (
    <>
      <Header hasSearchBar />
      <div className="grid mt-20 place-items-center">
        <div className="grid place-items-center">
          <ChainTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <div className="flex items-center flex-row space-x-5 mt-1.5">
            {renderSelectedTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressPage;
