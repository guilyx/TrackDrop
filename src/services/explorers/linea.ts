import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class LineaExplorerService extends StandardExplorerService {
  constructor() {
    super('api.lineascan.build', "linea", 'https://explorer.linea.build', ETH_TOKEN);
  }
}

export default LineaExplorerService;
