import {BaseEntity} from '@minhdu-fontend/base-entity';
import {DiscountTypeEnum, StockEnum} from "../../../../shared/enums";

export interface BaseStockEntity extends BaseEntity {
  readonly type: StockEnum
  readonly price: number;
  readonly amount: number;
  readonly accountedAt: Date,
  readonly billedAt: Date,
  readonly billCode: string,
  readonly discount?: number;
  readonly discountType?: DiscountTypeEnum;
  readonly orderedAt?: Date
  readonly importAt?: Date
  readonly completeAt?: Date
  readonly note?: string
}
