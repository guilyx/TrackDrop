import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';

class TaikoExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.test.taiko.xyz', "taiko");
  }
}

export default TaikoExplorerService;
