import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseSalaryEntity } from '../../base';

export interface BaseAddAllowanceSalaryDto extends BaseSalaryEntity {
  readonly payrollId: number;
  readonly datetime: Date;
}

export type AddAllowanceSalaryDto = BaseAddDto<BaseAddAllowanceSalaryDto>;
