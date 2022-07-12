import { BasePositionEntity } from '../bases';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdatePositionDto extends Omit<BasePositionEntity, 'id'> {
  positionIds?: number[];
}

export type UpdatePositionDto = BaseUpdateDto<BaseUpdatePositionDto>;
