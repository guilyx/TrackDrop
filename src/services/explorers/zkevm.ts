import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class ZkEvmExplorerService extends StandardExplorerService {
  constructor() {
    super('api-zkevm.polygonscan.com', 'zkevm', 'https://zkevm.polygonscan.com', ETH_TOKEN);
  }
}

export default ZkEvmExplorerService;
