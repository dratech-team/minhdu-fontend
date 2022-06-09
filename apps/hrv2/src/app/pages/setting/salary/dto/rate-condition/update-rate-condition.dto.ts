import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {BaseRateConditionEntity} from "../../bases/base-rate-condition.entity";

export type BaseUpdateRateConditionDto = Omit<BaseRateConditionEntity, 'id'>

export type UpdateRateConditionDto = BaseUpdateDto<BaseUpdateRateConditionDto>
