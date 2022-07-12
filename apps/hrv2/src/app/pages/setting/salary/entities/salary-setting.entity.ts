import {
  DatetimeUnitEnum,
  EmployeeType,
  SalaryTypeEnum,
} from '@minhdu-fontend/enums';
import { BaseSalarySettingEntity } from '../bases';
import { SalaryConstraintEntity } from './salary-constraint.entity';
import { PriceType } from '../enums';
import { BranchEntity, PositionEntity } from '@minhdu-fontend/orgchart-v2';
import { RateConditionEntity } from './rate-condition.entity';

export interface SalarySettingEntity extends BaseSalarySettingEntity {
  type: SalaryTypeEnum;
  title: string;
  price?: number;
  prices?: number[];
  reference?: PriceType;
  constraints?: SalaryConstraintEntity[];
  branches?: BranchEntity[];
  unit?: DatetimeUnitEnum;
  totalOf: SalaryTypeEnum[];
  workday?: number;
  employeeType?: EmployeeType;
  positions?: PositionEntity[];
  rateCondition?: RateConditionEntity;
}
