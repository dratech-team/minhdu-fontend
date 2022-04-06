import { MigrateEnum } from '../enums';
import { stockEntity } from '../../stock/entities';
import { BaseMigrateEntity } from '../bases';

export interface MigrateEntity extends BaseMigrateEntity {
  readonly product: stockEntity;
  readonly type: MigrateEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
