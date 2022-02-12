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
