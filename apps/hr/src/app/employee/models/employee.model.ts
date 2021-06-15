import { Department } from '../department/model/department.model';
import { Branch } from '../branch/model/branch.model';
import { Position } from '../position/model/position.model';
import { Gender } from '../../../../../../libs/shared/enums/gender.enum';

export interface Employee {
  id?: number;
  name?: string;
  avt?: string;
  address?: string;
  identify?: string;
  idCardAt?: Date;
  branchId?: string;
  departmentId?: number;
  positionId?: number;
  phone?: string;
  birthday?: Date;
  gender?: Gender;
  isFlatSalary?: boolean;
  price?: number;
  workedAt?: Date;
  leftAt?: Date;
  certificate?: string;
  stayedAt?: Date|null;
  contractAt?: Date|null;
  branch?: Branch;
  department?: Department;
  position?: Position;
  qrcode?: string;
  note?: string;
  birthplace?:string;
  createdAt?: Date|null;
  zalo?:string;
}
