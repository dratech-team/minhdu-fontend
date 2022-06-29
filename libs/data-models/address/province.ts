import { Nation } from './nation';
import { BaseAddress } from './base-address';
import { District } from './district';

export interface Province extends BaseAddress {
  nationId: number;
  nation: Nation;
  districts: District[];
}
