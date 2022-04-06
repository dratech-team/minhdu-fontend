import {BaseEntity} from '../../../../../../../libs/entities';
import {Branch} from "@minhdu-fontend/data-models";
import {CategoryEntity} from "../../category/entities";
import {ProviderEntity} from "../../provider/entities";
import {WarehouseUnit} from "../../category/enums";
import {DiscountTypeEnum, StockEnum} from "../../../../shared/enums";

export interface BaseProductEntity extends BaseEntity {
  readonly name: string;
  readonly code: string;
  readonly category: CategoryEntity

  readonly price: number;
  readonly amount: number;
  readonly accountedAt: Date,
  readonly billedAt: Date,
  readonly billCode: string,
  readonly barcode?: string;
  readonly discount?: number;
  readonly discountType?: DiscountTypeEnum;
  readonly branch?: Branch;
  readonly mfg?: Date;
  readonly exp?: Date;
  readonly warehouse: CategoryEntity;
  readonly provider: ProviderEntity;
  readonly unit: WarehouseUnit;
}
