import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { Transaction } from './explorer.ts';
class ScrollExplorerService extends StandardExplorerService {
  constructor() {
    super('api.scrollscan.com', 'scroll', './chains/scroll.svg', 'https://blockscout.scroll.io/', ETH_TOKEN);
  }

  needInternalTx(): boolean {
    return true;
  }

  isFromBridge(tx: Transaction): boolean {
    if (!tx.from) return false;
    if (tx.from.toLowerCase() === '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8'.toLowerCase()) {
      return true;
    } else if (tx.to.toLowerCase() === '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8'.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default ScrollExplorerService;
