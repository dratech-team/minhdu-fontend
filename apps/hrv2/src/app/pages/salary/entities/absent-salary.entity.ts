import { BaseSalaryEntity } from '../base';
import { PayrollEntity } from '../../payroll/entities';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { SalarySettingEntity } from '../../setting/salary/entities';

export interface AbsentSalaryEntity extends BaseSalaryEntity {
  readonly payroll?: PayrollEntity;
  readonly setting?: SalarySettingEntity;
  readonly partial?: PartialDayEnum;
  readonly total: number;
  readonly rate: number;
  readonly startedAt?: Date;
  readonly endedAt?: Date;
  readonly duration: number;
}
