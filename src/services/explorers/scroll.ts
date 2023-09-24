import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';
import { Transaction } from './explorer.ts';
class ScrollExplorerService extends StandardExplorerService {
  constructor() {
    super(
      'sepolia-blockscout.scroll.io',
      'scroll',
      './chains/scroll.svg',
      'https://sepolia-blockscout.scroll.io/',
      ETH_TOKEN,
    );
  }

  needInternalTx(): boolean {
    return true;
  }

  isFromBridge(tx: Transaction): boolean {
    if (!tx.from) return false;
    if (tx.from.toLowerCase() === '0x91e8addfe1358aca5314c644312d38237fc1101c'.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default ScrollExplorerService;
