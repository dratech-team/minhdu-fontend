import { WarehouseUnit } from './warehouse-unit.entity';
import { Branch } from '@minhdu-fontend/data-models';

export interface Warehouse {
  readonly  id: number;
  readonly name: string;
}

export interface Provider {
  readonly id: number;
  readonly  name: string;
}

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

export interface ProductDto extends Omit<Product, 'branch' | 'warehouse' | 'provider'> {
  readonly branchId: number;
  readonly warehouseId: number;
  readonly providerId: number;
};
