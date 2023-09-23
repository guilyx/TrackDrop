import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { Transaction } from './explorer.ts';

class ZoraExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.zora.energy', "zora", "./chains/zora.svg", 'https://explorer.zora.energy/', ETH_TOKEN);
  }

  isFromBridge(tx: Transaction): boolean {
    if (!tx.from) return false;
    if (tx.from.toLowerCase() === this.address.toLowerCase() && tx.to.toLowerCase() === this.address.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default ZoraExplorerService;
