import {BaseSearchDto} from '@minhdu-fontend/base-dto';
import {BaseSupplierEntity} from "../bases";

export interface BaseSearchSupplierDto extends BaseSupplierEntity {

}

export type SearchSupplierDto = BaseSearchDto<BaseSearchSupplierDto>
