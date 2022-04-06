import {BaseProductEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchProductDto extends BaseProductEntity{

}

export type SearchProductDto = BaseSearchDto<BaseSearchProductDto>
