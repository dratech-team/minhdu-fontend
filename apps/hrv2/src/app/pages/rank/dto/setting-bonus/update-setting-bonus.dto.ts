import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {BaseSettingRankEntity} from "../../bases/base-setting-rank.entity";

export interface BaseUpdateSettingBonusDto extends BaseSettingRankEntity {
  form: number,
  to: number,
  price: number,
  rankSettingId: number
}

export type UpdateSettingBonusDto = BaseUpdateDto<BaseUpdateSettingBonusDto>
