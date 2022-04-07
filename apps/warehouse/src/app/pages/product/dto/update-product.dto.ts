import {BaseProductEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

interface BaseUpdateProductDto extends BaseProductEntity{
}

export type UpdateProductDto = BaseUpdateDto<BaseUpdateProductDto>
