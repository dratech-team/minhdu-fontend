import {BaseSalaryEntity} from '../../base';
import {BaseUpdateDto} from '@minhdu-fontend/base-dto';

export interface BaseUpdatePermanentDto extends BaseSalaryEntity {
  readonly salaryIds: number[]
  readonly startedAt?: Date,
  readonly endedAt?: Date
}

export type UpdatePermanentSalaryDto = BaseUpdateDto<BaseUpdatePermanentDto>
