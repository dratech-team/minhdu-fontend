import {BaseProductEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

interface BaseAddStockDto extends BaseProductEntity {

}

export type AddProductDto = BaseAddDto<BaseAddStockDto>
