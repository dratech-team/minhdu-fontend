import {
  Degree,
  Position,
  Relative,
  SalaryHistory,
  Ward,
  WorkHistory
} from '@minhdu-fontend/data-models';
import { ContractsEnum, Gender } from '@minhdu-fontend/enums';
import { Payroll } from 'apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface';
import { Branch } from '../orgChart/branch';
import { Contracts } from './contracts';


export interface Employee {
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
  workday:number,
  contractAt: string,
  leftAt: Date,
  isFlatSalary: boolean,
  position: Position,
  branch: Branch,
  note?: string;
  facebook: string,
  zalo: string,
  degrees?: Degree[],
  bhyt?: string,
  payrolls: Payroll[],
  contracts: Contracts[];
  relatives: Relative[],
  isSelect?: boolean;
  isSelectAllowance?: boolean;
  workHistories?: WorkHistory[];
  historySalaries: SalaryHistory[];
  contractType?: string,
  recipeType: Boolean
}

