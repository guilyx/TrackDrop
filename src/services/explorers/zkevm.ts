import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';

class ZkEvmExplorerService extends StandardExplorerService {
  constructor() {
    super('api-zkevm.polygonscan.com', "zkevm", 'https://zkevm.polygonscan.com');
  }
}

export default ZkEvmExplorerService;
