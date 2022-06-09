import {BaseEntity} from "@minhdu-fontend/base-entity";
import {ConditionEnum} from "../enums/condition.enum";
import {RateConditionEnum} from "../enums/rate-condition.enum";

export interface BaseRateConditionEntity extends BaseEntity {
  condition: ConditionEnum,
  with: number
  default: number,
  type: RateConditionEnum,
}
