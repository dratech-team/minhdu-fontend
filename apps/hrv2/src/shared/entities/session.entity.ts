import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';

export interface SessionEntity {
  readonly name: string;
  readonly detail: string;
  readonly value: PartialDayEnum;
  readonly unit: DatetimeUnitEnum;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly types: SalaryTypeEnum[];
}
