import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class ZetaExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.zetachain.com', "zora", "./chains/zora.svg", 'https://explorer.zetachain.com/', ETH_TOKEN);
  }
}

export default ZetaExplorerService;
