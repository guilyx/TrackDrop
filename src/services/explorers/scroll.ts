import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';

class ScrollExplorerService extends StandardExplorerService {
  constructor() {
    super('blockscout.scroll.io', "scroll");
  }
}

export default ScrollExplorerService;
