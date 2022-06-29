import { BaseDepartmentEntity } from '../bases';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

export interface BaseAddDepartmentDto extends BaseDepartmentEntity {}

export type AddDepartmentDto = BaseAddDto<BaseAddDepartmentDto>;
