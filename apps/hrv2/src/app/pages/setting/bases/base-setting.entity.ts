import {BaseEntity} from "@minhdu-fontend/base-entity";
import {Employee} from "@minhdu-fontend/data-models";

export interface BaseSettingEntity extends BaseEntity {
  employee:Employee,
  dayOff:number,
  salary: number
}
