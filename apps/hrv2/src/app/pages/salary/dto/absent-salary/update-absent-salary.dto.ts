import { BaseSalaryEntity } from '../../base';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateAbsentDto extends BaseSalaryEntity {
  readonly settingId: number,
  readonly startedAt: Date,
  readonly endedAt: Date
}

export type UpdateAbsentSalaryDto = BaseUpdateDto<BaseUpdateAbsentDto>
