import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class NovaExplorerService extends StandardExplorerService {
  constructor() {
    super('nova-explorer.arbitrum.io', "nova", "./chains/nova.svg", 'https://nova-explorer.arbitrum.io/', ETH_TOKEN);
  }
}

export default NovaExplorerService;
