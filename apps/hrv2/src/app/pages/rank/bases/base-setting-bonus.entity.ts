import {BaseEntity} from "@minhdu-fontend/base-entity";
import {BonusTypeEnum} from "../enums/bonus-type.enum";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";

export interface BaseSettingBonusEntity extends BaseEntity {
  type: BonusTypeEnum,
  unit: DatetimeUnitEnum,
  rate: number
  diligent: string
}
