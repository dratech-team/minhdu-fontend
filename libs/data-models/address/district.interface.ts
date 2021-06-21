import { BaseAddress } from './base-address.interface';
import { Ward } from './ward.interface';
import { Province } from './province.interface';

export interface District extends BaseAddress{
  provinceId: number,
  province:Province,
  wards: Ward[]
}
