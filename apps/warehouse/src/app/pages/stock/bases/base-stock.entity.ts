import { BaseEntity } from '../../../../../../../libs/entities';
import {Branch} from "@minhdu-fontend/data-models";
import {WarehouseEntity} from "../../warehouse/entities";
import {ProviderEntity} from "../../provider/entities";
import {WarehouseUnit} from "../../warehouse/enums";

export interface BaseStockEntity extends BaseEntity {
  readonly name: string;
  readonly code?: string;
  readonly mfg?: Date;
  readonly exp?: Date;
  readonly accountedAt?: Date;
  readonly billedAt?: Date;
  readonly barcode?: string;
  readonly branch?: Branch;
  readonly warehouse: WarehouseEntity;
  readonly price: number;
  readonly amount: number;
  readonly discount?: number;
  readonly provider: ProviderEntity;
  readonly note?: string;
  readonly unit: WarehouseUnit;
  readonly createdAt?: Date;
}
