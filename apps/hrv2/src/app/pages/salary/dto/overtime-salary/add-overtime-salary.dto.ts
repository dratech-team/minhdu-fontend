import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseSalaryEntity } from '../../base';

export interface BaseAddOvertimeSalaryDto extends BaseSalaryEntity {
  readonly payrollId: number;
  readonly settingId: number;
  readonly startedAt: Date;
  readonly endedAt: Date;
  readonly allowances?: {
    title: string;
    price: number;
  };
}

export type AddOvertimeSalaryDto = BaseAddDto<BaseAddOvertimeSalaryDto>;
