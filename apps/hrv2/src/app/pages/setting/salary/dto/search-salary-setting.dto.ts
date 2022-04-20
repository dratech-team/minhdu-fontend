import {BaseSalarySettingEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "../enums";

export interface BaseSearchSalarySettingDto extends BaseSalarySettingEntity{
  readonly salaryType?: SalaryTypeEnum
}

export type SearchSalarySettingDto = BaseSearchDto<BaseSearchSalarySettingDto>
