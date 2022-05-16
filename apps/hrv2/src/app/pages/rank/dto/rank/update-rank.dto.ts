import {BaseRankEntity} from "../../bases/base-rank.entity";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

export interface BaseUpdateRankDto extends BaseRankEntity {

}

export type UpdateRankDto = BaseUpdateDto<BaseUpdateRankDto>
