import { MigrateEnum } from '../enums';
import { sotckEntity } from '../../stock/entities';
import { BaseMigrateEntity } from '../bases';

export interface MigrateEntity extends BaseMigrateEntity {
  readonly product: sotckEntity;
  readonly type: MigrateEnum;
  readonly amount: number;
  readonly timestamp: Date;
}
