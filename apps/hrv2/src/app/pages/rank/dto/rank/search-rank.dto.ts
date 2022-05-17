import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {BaseRankEntity} from "../../bases/base-rank.entity";

export interface BaseSearchRankDto extends BaseRankEntity {

}

export type SearchRankDto = BaseSearchDto<BaseSearchRankDto>
