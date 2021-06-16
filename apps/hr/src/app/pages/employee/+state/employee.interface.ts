import { Gender } from '../../../../../../../libs/enums/gender.enum';

export interface Employee {
  id?: number;
  name?: string;
  avt?: string;
  address?: string;
  identify?: string;
  idCardAt?: Date;
  phone?: string;
  birthday?: Date;
  gender?: Gender;
  isFlatSalary?: boolean;
  price?: number;
  workedAt?: Date;
  leftAt?: Date;
  certificate?: string;
  stayedAt?: Date | null;
  contractAt?: Date | null;
  branchId?: number;
  branch?: any;
  departmentId?: number;
  department?: any;
  positionId?: number;
  position?: any;
  qrcode?: string;
  note?: string;
  birthplace?: string;
  createdAt?: Date | null;
  zalo?: string;
}
