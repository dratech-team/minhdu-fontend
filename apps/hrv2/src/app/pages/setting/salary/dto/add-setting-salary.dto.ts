import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {BaseSettingSalaryEntity} from "../bases";
import {SalaryTypeEnum} from "../enums";

export interface BaseAddSalarySettingDto extends Omit<BaseSettingSalaryEntity,'id'>  {
  readonly price?: number
  readonly settingType: SalaryTypeEnum,
  readonly constraint?: SalaryTypeEnum[],
  readonly workday?:number
  readonly types?:SalaryTypeEnum[],

}

export type AddSettingSalaryDto = BaseAddDto<BaseAddSalarySettingDto>
