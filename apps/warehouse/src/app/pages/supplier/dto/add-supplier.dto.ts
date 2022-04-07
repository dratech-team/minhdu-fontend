import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseSupplierEntity} from "../bases";

export interface BaseAddSupplierDto extends BaseSupplierEntity{

}

export type AddSupplierDto = BaseAddDto<BaseAddSupplierDto>
