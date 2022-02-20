import { Product } from '../../dashboard/entities/product.entity';
import { ImportExportEnum } from './import-export.enum';

export interface ImportExportEntity {
  readonly id: number;
  readonly product: Product;
  readonly type: ImportExportEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
