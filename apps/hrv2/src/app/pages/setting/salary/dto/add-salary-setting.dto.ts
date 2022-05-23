import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseSalarySettingEntity} from "../bases";
import {SalaryTypeEnum} from "../enums";

export interface BaseAddSalarySettingDto extends Omit<BaseSalarySettingEntity, 'id'> {
  readonly price?: number,
  readonly settingType: SalaryTypeEnum,
  readonly constraint?: SalaryTypeEnum[],
  readonly workday?: number,
  readonly totalOf?: SalaryTypeEnum[],
  readonly positionIds?: number [],
  readonly branchIds?: number []
  readonly hasConstraints?: boolean
}

export type AddSalarySettingDto = BaseAddDto<BaseAddSalarySettingDto>
