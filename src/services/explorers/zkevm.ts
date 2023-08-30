import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class ZkEvmExplorerService extends StandardExplorerService {
  constructor() {
    super('api-zkevm.polygonscan.com', "zkevm", "./chains/zkevm.svg", 'https://zkevm.polygonscan.com', ETH_TOKEN);
  }
}

export default ZkEvmExplorerService;
