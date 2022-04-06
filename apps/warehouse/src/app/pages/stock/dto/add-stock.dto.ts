import {BaseStockEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";

interface BaseAddStockDto extends BaseStockEntity {

}

export type AddStockDto = BaseAddDto<BaseAddStockDto>
