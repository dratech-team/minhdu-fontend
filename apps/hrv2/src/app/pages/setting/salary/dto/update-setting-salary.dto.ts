import {BaseSettingSalaryEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {SalaryTypeEnum} from "../enums";

interface BaseUpdateSettingSalaryDto extends BaseSettingSalaryEntity{
  readonly price?: number
  readonly settingType: SalaryTypeEnum,
  readonly constraint?: SalaryTypeEnum[],
  readonly workday?:number
  readonly types?:SalaryTypeEnum[],
}

export type UpdateSettingSalaryDto = BaseUpdateDto<BaseUpdateSettingSalaryDto>
