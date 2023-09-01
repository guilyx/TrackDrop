import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class TaikoExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.test.taiko.xyz', "taiko", "./chains/taiko.svg", 'https://explorer.test.taiko.xyz', ETH_TOKEN);
  }
}

export default TaikoExplorerService;
