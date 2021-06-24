import { District } from './district';
import { BaseAddress } from './base-address';

export interface Ward extends BaseAddress{
  districtId: number,
  district: District,
}
