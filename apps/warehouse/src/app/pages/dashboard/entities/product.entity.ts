import { Branch } from '@minhdu-fontend/data-models';
import { WarehouseUnit } from '../../warehouse/state/entities/warehouse-unit.entity';
import { Provider, Warehouse } from '../../warehouse/state/entities/product.entity';

export interface Product {
  readonly name: string;
  readonly code?: string;
  readonly mfg?: Date;
  readonly exp?: Date;
  readonly accountedAt?: Date;
  readonly billedAt?: Date;
  readonly billCode?: string;
  readonly branch?: Branch;
  readonly warehouse?: Warehouse;
  readonly price?: number;
  readonly  amount: number;
  readonly discount?: number;
  readonly provider?: Provider;
  readonly note?: string;
  readonly unit: WarehouseUnit;
  readonly createdAt?: Date;
}
