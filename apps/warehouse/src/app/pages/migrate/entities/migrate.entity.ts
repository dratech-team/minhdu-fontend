import { MigrateEnum } from '../enums/migrate.enum';
import { Product } from '../../product/entities/product.entity';

export interface MigrateEntity {
  readonly id: number;
  readonly product: Product;
  readonly type: MigrateEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
