import { MigrateEnum } from '../enums';
import { Product } from '../../product/entities';
import { BaseMigrateEntity } from './base-migrate.entity';

export interface MigrateEntity extends BaseMigrateEntity {
  readonly product: Product;
  readonly type: MigrateEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
