import {BaseSalarySettingEntity} from "../bases";
import {BaseSearchDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";
import {NzTableSortOrder} from "ng-zorro-antd/table";

export interface BaseSearchSalarySettingDto extends BaseSalarySettingEntity {
  readonly search: string
  readonly types?: SalaryTypeEnum[]
  readonly payrollId?: number,
  readonly positionIds?: number [],
  readonly branchIds?: number [],
  readonly orderBy?: string
  readonly orderType?: NzTableSortOrder
}

export type SearchSalarySettingDto = BaseSearchDto<BaseSearchSalarySettingDto>
