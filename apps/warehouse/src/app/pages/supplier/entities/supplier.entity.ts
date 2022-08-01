import { BaseSupplierEntity } from '../bases';
import { ProductEntity } from '../../product/entities';

export interface SupplierEntity extends BaseSupplierEntity {
  products: ProductEntity[];
}
