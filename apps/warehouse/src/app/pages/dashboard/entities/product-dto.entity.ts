import { Product } from './product.entity';

export interface ProductDto extends Omit<Product, 'branch' | 'warehouse' | 'provider'> {
  readonly branchId: number;
  readonly warehouseId: number;
  readonly providerId: number;
};
