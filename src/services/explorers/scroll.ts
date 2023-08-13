import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class ScrollExplorerService extends StandardExplorerService {
  constructor() {
    super('blockscout.scroll.io', 'scroll', 'https://blockscout.scroll.io/', ETH_TOKEN);
  }
}

export default ScrollExplorerService;
