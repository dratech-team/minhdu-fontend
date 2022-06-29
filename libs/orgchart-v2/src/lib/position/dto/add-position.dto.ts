import { BasePositionEntity } from '../bases';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddPositionDto extends Omit<BasePositionEntity, 'id'> {
  branchIds?: number[];
}

export type AddPositionDto = BaseAddDto<BaseAddPositionDto>;
