import { BaseDepartmentEntity } from '../bases';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

export interface BaseUpdateDepartmentDto extends BaseDepartmentEntity {
  positionIds?: number[];
}

export type UpdateDepartmentDto = BaseUpdateDto<BaseUpdateDepartmentDto>;
