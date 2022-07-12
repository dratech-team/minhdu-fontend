import {
  AddManyPayrollDto,
  BaseAddManyPayrollDto,
} from './add-many-payroll.dto';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddPayrollDto extends BaseAddManyPayrollDto {
  employeeId: number;
}

export type AddPayrollDto = BaseAddDto<BaseAddPayrollDto>;
