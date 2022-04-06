import {BaseStockEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

interface BaseSearchStockDto extends BaseStockEntity{

}

export type SearchStockDto = BaseSearchDto<BaseSearchStockDto>
