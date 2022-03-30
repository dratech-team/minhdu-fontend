import { Product } from '../entities';

export interface AddProductDto extends Omit<Product, 'branch' | 'warehouse' | 'provider'> {
  readonly branchId: number;
  readonly branch: string;
  readonly warehouseId: number | null;
  readonly warehouse: string;
  readonly providerId: number;
  readonly provider: string;
};