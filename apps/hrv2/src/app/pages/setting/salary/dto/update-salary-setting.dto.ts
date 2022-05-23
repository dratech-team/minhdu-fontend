import {BaseSalarySettingEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "../enums";

interface BaseUpdateSalarySettingDto extends BaseSalarySettingEntity {
  readonly price?: number
  readonly settingType: SalaryTypeEnum,
  readonly constraint?: SalaryTypeEnum[],
  readonly workday?: number
  readonly totalOf?: SalaryTypeEnum[],
  readonly positionIds?: number []
  readonly branchIds?: number []
  readonly hasConstraints?: boolean
}

export type UpdateSalarySettingDto = BaseUpdateDto<BaseUpdateSalarySettingDto>
