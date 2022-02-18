import { Product } from '../entities/product.entity';

export interface CreateProductDto extends Omit<Product, 'branch' | 'warehouse' | 'provider'> {
  readonly branchId: number;
  readonly warehouseId: number | null;
  readonly providerId: number;
};
