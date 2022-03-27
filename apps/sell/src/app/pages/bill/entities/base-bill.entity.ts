import { BaseEntity } from '@minhdu-fontend/base-entity';
import { CurrencyUnit } from '@minhdu-fontend/enums';

export interface BaseBillEntity extends BaseEntity {
  readonly createdAt: Date;
  readonly explain: string;
  readonly currency: CurrencyUnit;
}
