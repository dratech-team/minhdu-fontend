import { Nation } from './nation.interface';
import { BaseAddress } from './base-address.interface';
import { District } from './district.interface';

export interface Province extends BaseAddress{
  nationId: number,
  nation: Nation,
  districts: District[],
}
