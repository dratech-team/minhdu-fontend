import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {BaseEntity} from '@minhdu-fontend/base-entity';
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {SalaryAllowanceEntity} from "../entities";

export interface BaseSalaryEntity extends BaseEntity {
  readonly title: string;
  readonly price?: number
  readonly unit: DatetimeUnitEnum,
  readonly partial: PartialDayEnum,
  readonly type?: SalaryTypeEnum;
  readonly allowances?: SalaryAllowanceEntity[]
}
