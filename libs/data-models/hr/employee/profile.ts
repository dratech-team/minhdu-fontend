import { Ward } from '../../address/ward';
import { GenderTypeEnum } from '../../../enums';

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  gender: GenderTypeEnum;
  phone: string;
  birthday: Date;
  identify: string;
  address: string;
  workPhone?: string;
  avt?: string;
  birthplace: string;
  idCardAt: Date;
  issuedBy: string;
  wardId: number;
  religion: string;
  ethnicity: string;
  mst?: string;
  email?: string;
  ward: Ward;
}
