import { BaseEntity } from '@minhdu-fontend/base-entity';
import { ProductEntity } from '../../product/entities';

export interface BaseWarehouseEntity extends BaseEntity {
  readonly name: string;
  readonly products: ProductEntity[];
}
