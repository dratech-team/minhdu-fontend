import { ImportExportEnum } from '../enums/import-export.enum';
import { Product } from '../../product/entities/product.entity';

export interface ImportExportEntity {
  readonly id: number;
  readonly product: Product;
  readonly type: ImportExportEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
