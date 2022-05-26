import {BaseSalarySettingEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

export interface BaseSearchSalarySettingDto extends BaseSalarySettingEntity{
  readonly search: string
  readonly types?: SalaryTypeEnum[]
  readonly payrollId?: number,
  readonly positionIds?: number [],
  readonly branchIds?: number []
}

export type SearchSalarySettingDto = BaseSearchDto<BaseSearchSalarySettingDto>
