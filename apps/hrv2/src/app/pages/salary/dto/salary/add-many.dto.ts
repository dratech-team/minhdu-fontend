import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseSalaryEntity } from '../../base';
import { PartialDayEnum } from '@minhdu-fontend/data-models';

export interface BaseAddManySalaryDto extends BaseSalaryEntity {
  settingId: number;
  partial?: PartialDayEnum;
  allowance?: {
    title: string;
    price: number;
  };
  startedAt?: Date;
  endedAt?: Date;
  rate: number;
  inWorkday?: boolean;
  inOffice?: boolean;
  total: number;
  payrollIds: number[];
}

export type addManySalaryDto = BaseAddDto<BaseAddManySalaryDto>;
