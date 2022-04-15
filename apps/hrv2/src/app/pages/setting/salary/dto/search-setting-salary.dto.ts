import {BaseSettingSalaryEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "../enums";

export interface BaseSearchSettingSalaryDto extends BaseSettingSalaryEntity{
  readonly salaryType?: SalaryTypeEnum
}

export type SearchSettingSalaryDto = BaseSearchDto<BaseSearchSettingSalaryDto>
