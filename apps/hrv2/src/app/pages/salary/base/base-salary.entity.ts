import {SalaryTypeEnum} from '@minhdu-fontend/enums';
import {BaseEntity} from '@minhdu-fontend/base-entity';
import {SalaryAllowanceEntity} from "../entities";

export interface BaseSalaryEntity extends BaseEntity {
  readonly title: string;
  readonly price: number
  readonly rate: number
  readonly note?: string
  readonly type: SalaryTypeEnum;
}
