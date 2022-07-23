import { BaseEntity } from '@minhdu-fontend/base-entity';
import { CommodityUnit } from '@minhdu-fontend/enums';

export interface BaseCommodityEntity extends BaseEntity {
  readonly code: string;
  readonly name: string;
  readonly amount: number;
  readonly unit: CommodityUnit;
  readonly price: number;
  readonly deliveredAt?: Date;
}
