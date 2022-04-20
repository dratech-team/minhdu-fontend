import { BaseSalaryEntity } from '../../base';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateOvertimeDto extends BaseSalaryEntity {
  readonly settingId: number,
  readonly startedAt: Date,
  readonly EndedAt: Date
}

export type UpdateOvertimeSalaryDto = BaseUpdateDto<BaseUpdateOvertimeDto>
