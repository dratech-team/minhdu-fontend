import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseSalaryEntity } from '../../base';

export interface BaseAddPermanentSalaryDto extends BaseSalaryEntity {
  readonly payrollIds: number[];
  readonly startedAt?: Date;
  readonly endedAt?: Date;
}

export type AddPermanentSalaryDto = BaseAddDto<BaseAddPermanentSalaryDto>;
