import { District } from './district.interface';
import { BaseAddress } from './base-address.interface';

export interface Ward extends BaseAddress{
  districtId: number,
  district: District,
}
