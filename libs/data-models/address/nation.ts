import { BaseAddress } from './base-address';
import { Province } from './province';

export interface Nation extends BaseAddress{
  provinces: Province[],
}
