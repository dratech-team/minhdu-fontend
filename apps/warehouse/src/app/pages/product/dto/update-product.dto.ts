import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {BaseProductEntity} from "../bases";
export interface BaseUpdateProductDto extends BaseProductEntity{

}

export type UpdateProductDto = BaseUpdateDto<BaseUpdateProductDto>
