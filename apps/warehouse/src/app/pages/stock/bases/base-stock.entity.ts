import {BaseEntity} from '../../../../../../../libs/entities';
import {Branch} from "@minhdu-fontend/data-models";
import {WarehouseEntity} from "../../warehouse/entities";
import {ProviderEntity} from "../../provider/entities";
import {WarehouseUnit} from "../../warehouse/enums";
import {StockEnum} from "../../../../shared/enums";

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
  readonly branch?: Branch;
  readonly name: string;
  readonly code?: string;
  readonly mfg?: Date;
  readonly exp?: Date;
  readonly warehouse: WarehouseEntity;

  readonly provider: ProviderEntity;
  readonly note?: string;
  readonly unit: WarehouseUnit;
}
