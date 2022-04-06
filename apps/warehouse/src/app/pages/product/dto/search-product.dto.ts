import {BaseProductEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";

export interface BaseSearchProductDto extends BaseProductEntity{
  readonly category?: number
  readonly supplier?: number,
}

export type SearchProductDto = BaseSearchDto<BaseSearchProductDto>
