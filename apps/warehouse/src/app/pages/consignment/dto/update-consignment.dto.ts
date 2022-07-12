import { BaseConsignmentEntity } from '../bases';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

interface BaseUpdateConsignmentDto extends BaseConsignmentEntity {}

export type UpdateConsignmentDto = BaseUpdateDto<BaseUpdateConsignmentDto>;
