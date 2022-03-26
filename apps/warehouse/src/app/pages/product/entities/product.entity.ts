import { Branch } from '@minhdu-fontend/data-models';
import { Provider, Warehouse } from '../../warehouse/entities/product.entity';
import { WarehouseUnit } from '../../warehouse/enums';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly code?: string;
  readonly mfg?: Date;
  readonly exp?: Date;
  readonly accountedAt?: Date;
  readonly billedAt?: Date;
  readonly barcode?: string;
  readonly branch?: Branch;
  readonly warehouse: Warehouse;
  readonly price: number;
  readonly amount: number;
  readonly discount?: number;
  readonly provider: Provider;
  readonly note?: string;
  readonly unit: WarehouseUnit;
  readonly createdAt?: Date;
}
