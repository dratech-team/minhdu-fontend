import {BaseSalarySettingEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface BaseSearchSalarySettingDto extends BaseSalarySettingEntity{
  readonly types?: SalaryTypeEnum[]
}

export type SearchSalarySettingDto = BaseSearchDto<BaseSearchSalarySettingDto>
