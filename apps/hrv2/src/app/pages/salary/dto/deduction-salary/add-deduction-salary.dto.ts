import {BaseAddDto} from '@minhdu-fontend/base-dto';
import {BaseSalaryEntity} from "../../base";
import {PartialDayEnum} from "@minhdu-fontend/data-models";

export interface BaseAddDeductionSalaryDto extends BaseSalaryEntity {
  readonly payrollIds: number[];
  readonly settingId: number;
  readonly startedAt: Date;
  readonly endedAt: Date
  readonly partial?: PartialDayEnum;
  readonly startTime: Date|null
  readonly endedTime: Date|null
}

export type AddDeductionSalaryDto = BaseAddDto<BaseAddDeductionSalaryDto>
