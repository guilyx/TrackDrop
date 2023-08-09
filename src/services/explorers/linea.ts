import axios, { AxiosResponse } from 'axios';
import { Token, Transfer, Transaction } from './explorer.ts';
import ExplorerService from './explorer.ts';
import StandardExplorerService from './standard_explorer.ts';

class LineaExplorerService extends StandardExplorerService {
  constructor() {
    super('api.lineascan.build', "linea");
  }
}

export default LineaExplorerService;
