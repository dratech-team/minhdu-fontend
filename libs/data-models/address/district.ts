import { BaseAddress } from './base-address';
import { Ward } from './ward';
import { Province } from './province';

export interface District extends BaseAddress{
  provinceId: number,
  province:Province,
  wards: Ward[]
}
