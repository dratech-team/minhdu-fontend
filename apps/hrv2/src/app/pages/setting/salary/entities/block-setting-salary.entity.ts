import { PriceType, SalaryTypeEnum } from '../enums';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

interface visible {
  show?: boolean;
  disabled?: boolean;
}

export interface BlockSettingSalaryEntity {
  title: string;
  type: SalaryTypeEnum;
  rate?: visible;
  units?: {
    name: string;
    value: DatetimeUnitEnum;
  }[];
  constraintHoliday?: visible;
  constraintOvertime?: visible;
  references?: {
    name: string;
    value: PriceType;
  }[];
  price?: visible;
  insurance?: visible;
}
