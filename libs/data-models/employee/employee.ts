 import {
  Degree,
  Position,
  Relative,
   Ward,
  WorkHistory
} from '@minhdu-fontend/data-models';
 import { ContractsEnum, Gender } from '@minhdu-fontend/enums';
 import { Payroll } from 'apps/hr/src/app/pages/payroll/+state/payroll.interface';


export interface Employee{
  id: number,
  code: string,
  firstName: string,
  lastName: string,
  avt?: string,
  gender: Gender,
  phone: string,
  workPhone?: string,
  birthday: Date,
  birthplace: string,
  identify: string,
  idCardAt: Date,
  issuedBy: string,
  ward: Ward,
  wardId: number,
  address: string,
  email?: string,
  religion: string,
  ethnicity: string,
  mst?: string,
  createdAt: Date,
  workedAt: Date;
  contractAt: string,
  leftAt: Date,
  isFlatSalary: boolean,
  position: Position,
  positionId:number,
  note?: string;
  facebook: string,
  zalo: string,
  degrees?: Degree[],
  WorkHistories?: WorkHistory,
  bhyt?: string,
  payrolls: Payroll[],
  contracts: ContractsEnum;
  relatives : Relative[],
  isSelect?: boolean;
}

