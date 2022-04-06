import {BaseProductEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

interface BaseUpdateStockDto extends BaseProductEntity{
}

export type UpdateProductDto = BaseUpdateDto<BaseUpdateStockDto>
