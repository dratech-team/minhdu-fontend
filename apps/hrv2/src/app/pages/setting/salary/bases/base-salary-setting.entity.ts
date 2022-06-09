import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseSalarySettingEntity extends BaseEntity {
  dayOff?: number,
  salary?: number
  note?: string,
  rate: number
  startedAt?:Date
  endedAt?:Date,
  rateConditionId?: number

}
