import { BaseSalaryEntity } from '../../base';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateDeductionDto extends BaseSalaryEntity {
  readonly settingId: number,
  readonly startedAt: Date,
  readonly endedAt: Date
}

export type UpdateDeductionSalaryDto = BaseUpdateDto<BaseUpdateDeductionDto>
