import { MigrateEnum } from '../enums';
import { StockEntity } from '../../stock/entities';
import { BaseMigrateEntity } from '../bases';

export interface MigrateEntity extends BaseMigrateEntity {
  readonly product: StockEntity;
  readonly type: MigrateEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
