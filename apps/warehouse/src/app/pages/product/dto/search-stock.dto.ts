import {BaseProductEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

interface BaseSearchStockDto extends BaseProductEntity{

}

export type SearchStockDto = BaseSearchDto<BaseSearchStockDto>
