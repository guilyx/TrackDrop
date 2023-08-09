import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';

class BaseExplorerService extends StandardExplorerService {
  constructor() {
    super("api.basescan.org", "base");
  }
}

export default BaseExplorerService;
