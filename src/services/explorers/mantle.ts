import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';
import { MANTLE_TOKEN } from '../../common/common.ts';

class MantleExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.mantle.xyz', "mantle", "./chains/mantle.svg", 'https://explorer.mantle.xyz/', MANTLE_TOKEN);
  }

  isFromBridge(tx: Transaction): boolean {
    if (!tx.from) return false;
    if (tx.from.toLowerCase() === '0x80c67432656d59144ceff962e8faf8926599bcf8'.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default MantleExplorerService;
