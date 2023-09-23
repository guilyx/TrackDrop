import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { Transaction } from './explorer.ts';

class TaikoExplorerService extends StandardExplorerService {
  constructor() {
    super('blockscoutapi.jolnir.taiko.xyz', 'taiko', './chains/taiko.svg', 'https://blockscoutapi.jolnir.taiko.xyz/', ETH_TOKEN);
  }

  needInternalTx(): boolean {
    return true;
  }

  isFromBridge(tx: Transaction): boolean {
    if (!tx.from) return false;
    if (tx.from.toLowerCase() === '0x1000777700000000000000000000000000000004'.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default TaikoExplorerService;
