import {BaseEntity} from '../../../../../../../libs/entities';
import {Branch} from "@minhdu-fontend/data-models";
import {CategoryEntity} from "../../category/entities";
import {SupplierEntity} from "../../supplier/entities";
import {CategoryUnitEnum} from "../../category/enums";
import {DiscountTypeEnum, StockEnum} from "../../../../shared/enums";

export interface BaseStockEntity extends BaseEntity {
  readonly type: StockEnum
  readonly createdAt: Date;
  readonly price: number;
  readonly amount: number;
  readonly accountedAt: Date,
  readonly billedAt: Date,
  readonly billCode: string,
  readonly barcode?: string;
  readonly discount?: number;
  readonly discountType?: DiscountTypeEnum;
  readonly branch?: Branch;
  readonly name: string;
  readonly code?: string;
  readonly mfg?: Date;
  readonly exp?: Date;
  readonly warehouse: CategoryEntity;
  readonly provider: SupplierEntity;
  readonly unit: CategoryUnitEnum;
}
