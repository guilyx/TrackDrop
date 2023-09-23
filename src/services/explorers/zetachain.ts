import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { Transaction } from './explorer.ts';

class ZetaExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.zetachain.com', "zora", "./chains/zora.svg", 'https://explorer.zetachain.com/', ETH_TOKEN);
  }

  isFromBridge(tx: Transaction): boolean {
    return false;
  }
}

export default ZetaExplorerService;
