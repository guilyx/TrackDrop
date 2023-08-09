import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';

class MantleExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.mantle.xyz', "mantle");
  }
}

export default MantleExplorerService;
