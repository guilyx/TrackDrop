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
      const tokens = await service.getTokenList(address);
      const transactions = await service.getTransactionsList(address);
      newTransactionLists[tabName] = transactions;
      newTokenList[tabName] = tokens;
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
      <div className="grid mt-20 place-items-center ">
        <div className="flex items-center flex-row space-x-5 mt-5">
          <InteractionsCard address={address} transactions={selectedTransactions} />
          <VolumeCard address={address} transactions={selectedTransactions} />
          <FeeCard address={address} transactions={selectedTransactions} />
        </div>
        <div className="flex items-center flex-row space-x-5 mt-1.5">
          <BalanceCard address={address} tokenList={tokens} explorer={explorer} />
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
