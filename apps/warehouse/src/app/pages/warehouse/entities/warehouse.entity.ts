import { BaseWarehouseEntity } from './base-warehouse.entity';

export interface WarehouseEntity extends BaseWarehouseEntity {
  readonly name: string;
}

