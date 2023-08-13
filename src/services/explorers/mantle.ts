import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';
import { MANTLE_TOKEN } from '../../common/common.ts';

class MantleExplorerService extends StandardExplorerService {
  constructor() {
    super('explorer.mantle.xyz', "mantle", 'https://explorer.mantle.xyz/', MANTLE_TOKEN);
  }
}

export default MantleExplorerService;
