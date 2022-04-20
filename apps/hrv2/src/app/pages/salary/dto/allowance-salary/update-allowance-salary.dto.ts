import { BaseSalaryEntity } from '../../base';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateAllowanceDto extends BaseSalaryEntity {
  readonly datetime: Date,

}

export type UpdateAllowanceSalaryDto = BaseUpdateDto<BaseUpdateAllowanceDto>
