import { BaseSupplierEntity } from '../bases/base-supplier.entity';
import { ProductEntity } from '../../product/entities';

export interface SupplierEntity extends BaseSupplierEntity {
  products: ProductEntity[];
}
