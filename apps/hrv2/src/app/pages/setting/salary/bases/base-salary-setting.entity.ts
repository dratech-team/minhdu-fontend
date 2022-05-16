import {BaseEntity} from "@minhdu-fontend/base-entity";
import {Employee} from "@minhdu-fontend/data-models";

export interface BaseSalarySettingEntity extends BaseEntity {
  dayOff?: number,
  salary?: number
  note?: string,
  rate: number
  startedAt?:Date
  endedAt?:Date
}
