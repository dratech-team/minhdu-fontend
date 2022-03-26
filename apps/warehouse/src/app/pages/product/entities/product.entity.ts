import { Branch } from '@minhdu-fontend/data-models';
import { WarehouseUnit } from '../../warehouse/enums';
import { WarehouseEntity } from '../../warehouse/entities';
import { ProviderEntity } from '../../provider/entities';
import { BaseProductEntity } from './base-product.entity';

export interface Product extends BaseProductEntity {
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
