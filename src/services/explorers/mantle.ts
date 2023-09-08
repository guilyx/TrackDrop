import StandardExplorerService from './standard_explorer.ts';
import { MANTLE_TOKEN } from '../../common/common.ts';
import { Transaction } from './explorer.ts';

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
