import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseSalaryEntity extends BaseEntity {
  readonly payrollId: number
  readonly type: SalaryTypeEnum;
  readonly title: string;
  readonly price: number;
  readonly note?: string;
  readonly unit: DatetimeUnitEnum
}

