import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { Transaction } from '../explorers/explorer.ts';

class ZkEvmExplorerService extends StandardExplorerService {
  constructor() {
    super('api-zkevm.polygonscan.com', 'zkevm', './chains/zkevm.svg', 'https://zkevm.polygonscan.com', ETH_TOKEN);
  }

  isFromBridge(tx: Transaction): boolean {
    if (tx.from.toLowerCase() === '0x80c67432656d59144ceff962e8faf8926599bcf8'.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default ZkEvmExplorerService;
