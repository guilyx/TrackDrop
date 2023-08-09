import { useEffect, useState } from 'react';
import Header from '../components/Header.tsx'; // Update the path accordingly
import ChainTabs from '../components/ChainTabs.tsx'; // Update the path accordingly

import { Transaction } from '../services/explorers/explorer.ts'

import ExplorerService from '../services/explorers/explorer.ts';
import ZkSyncService from '../services/explorers/zksync.ts'; // Import the appropriate services
import BaseService from '../services/explorers/base.ts';

import InteractionsCard from '../components/InteractionsCard.tsx'; // Update the path accordingly
import FeeCard from '../components/FeeCard.tsx';
import VolumeCard from '../components/VolumeCard.tsx';

const AddressPage = () => {
  const address = window.location.search.split('=')[1];

  const zkSyncService = new ZkSyncService();
  const baseService = new BaseService();
  const availableExplorers: Map<string, ExplorerService> = new Map();
  availableExplorers.set('zkSync', zkSyncService);
  availableExplorers.set('Base', baseService);

  const [selectedTab, setSelectedTab] = useState('');
  const [transactionLists, setTransactionLists] = useState<Record<string, Transaction[]>>({});

  useEffect(() => {
    if (!address || address.length !== 42 || address.slice(0, 2) !== '0x') {
      window.location.search = '';
      return;
    }
    fetchTransactionList();
  }, [address]);

  const fetchTransactionList = async () => {
    const newTransactionLists: Record<string, Transaction[]> = {};
    for (const [tabName, service] of availableExplorers) {
      const transactions = await service.getTransactionsList(address);
      newTransactionLists[tabName] = transactions;
    }
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
    
    return (
      <div className="flex items-center flex-row space-x-5 mt-5">
        <InteractionsCard address={address} transactions={selectedTransactions} />
        <VolumeCard address={address} transactions={selectedTransactions} />
        <FeeCard address={address} transactions={selectedTransactions} />
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
