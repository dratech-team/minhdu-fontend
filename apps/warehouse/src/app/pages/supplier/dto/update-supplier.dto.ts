import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import { BaseSupplierEntity } from '../bases';

export interface BaseUpdateSupplierDto extends BaseSupplierEntity {}

export type UpdateSupplierDto = BaseUpdateDto<BaseUpdateSupplierDto>;
