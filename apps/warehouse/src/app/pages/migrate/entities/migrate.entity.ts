import { MigrateEnum } from '../enums';
import { Product } from '../../stock/entities';
import { BaseMigrateEntity } from '../bases';

export interface MigrateEntity extends BaseMigrateEntity {
  readonly product: Product;
  readonly type: MigrateEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
