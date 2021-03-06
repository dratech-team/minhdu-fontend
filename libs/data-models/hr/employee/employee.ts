import { Degree, Position, Relative, SalaryHistory, Ward, WorkHistory } from '@minhdu-fontend/data-models';
import { Payroll } from 'apps/hr/src/app/pages/payroll/+state/payroll/payroll.interface';
import { Branch } from '../orgChart/branch';
import { Contracts } from './contracts';
import { EmployeeType, GenderTypeEnum, RecipeType } from '../../../enums';
import { Salary } from '../salary/salary';
import { Category } from './category';

export interface Employee {
  id: number;
  stt?: number;
  code: string;
  lastName: string;
  avt?: string;
  gender: GenderTypeEnum;
  phone?: string;
  workPhone?: string;
  birthday: Date;
  birthplace: string;
  identify: string;
  idCardAt: Date;
  issuedBy: string;
  ward: Ward;
  wardId: number;
  address: string;
  email?: string;
  religion: string;
  ethnicity: string;
  mst?: string;
  createdAt: Date;
  workedAt: Date;
  workday: number;
  contractAt: string;
  leftAt: Date;
  isFlatSalary: boolean;
  position: Position;
  branch: Branch;
  note?: string;
  facebook: string;
  zalo: string;
  degrees?: Degree[];
  bhyt?: string;
  payrolls: Payroll[];
  contracts: Contracts[];
  relatives: Relative[];
  workHistories?: WorkHistory[];
  historySalaries: SalaryHistory[];
  contractType?: string;
  recipeType: RecipeType;
  salaryHistories: Salary[];
  type: EmployeeType;
  isSelect?: boolean;
  category?: Category;
}
