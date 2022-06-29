import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import { BaseSalaryEntity } from '../../base';
import { PartialDayEnum } from '@minhdu-fontend/data-models';

export interface BaseUpdateManySalaryDto extends BaseSalaryEntity {
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
  salaryIds: number[];
}

export type updateManySalaryDto = BaseUpdateDto<BaseUpdateManySalaryDto>;
