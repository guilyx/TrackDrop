import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class LineaExplorerService extends StandardExplorerService {
  constructor() {
    super('api.lineascan.build', "linea", "./chains/linea.svg", 'https://explorer.linea.build', ETH_TOKEN);
  }

  needInternalTx(): boolean {
    return true;
  }

  isFromBridge(tx: Transaction): boolean {
    if (tx.from.toLowerCase() === '0x508ca82df566dcd1b0de8296e70a96332cd644ec'.toLowerCase()) {
      return true;
    }
    return false;
  }
}

export default LineaExplorerService;
