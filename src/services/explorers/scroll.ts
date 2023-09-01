import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';
import { ETH_TOKEN } from '../../common/common.ts';

class ScrollExplorerService extends StandardExplorerService {
  constructor() {
    super('sepolia-blockscout.scroll.io', 'scroll', "./chains/scroll.svg", 'https://sepolia-blockscout.scroll.io/', ETH_TOKEN);
  }
}

export default ScrollExplorerService;
