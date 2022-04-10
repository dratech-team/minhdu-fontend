import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseStockEntity} from "../bases";

export interface BaseAddStockDto extends BaseStockEntity  {
}

export type AddStockDto = BaseAddDto<BaseAddStockDto>
