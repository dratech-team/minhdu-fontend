import { BaseSalaryEntity } from '../../base';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdatePermanentDto extends BaseSalaryEntity {
}

export type UpdatePermanentSalaryDto = BaseUpdateDto<BaseUpdatePermanentDto>
