import { BaseAddress } from './base-address.interface';
import { Province } from './province.interface';

export interface Nation extends BaseAddress{
  provinces: Province[],
}
