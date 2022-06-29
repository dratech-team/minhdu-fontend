import { BaseEntity } from '@minhdu-fontend/base-entity';
import { DiscountTypeEnum, IoiReceiptEnum } from '../../../../shared/enums';

export interface BaseIoiReceiptEntity extends BaseEntity {
  readonly type: IoiReceiptEnum;
  readonly accountedAt: Date;
  readonly billedAt: Date;
  readonly billCode: string;
  readonly discount?: number;
  readonly discountType?: DiscountTypeEnum;
  readonly orderedAt?: Date;
  readonly importedAt?: Date;
  readonly completedAt?: Date;
  readonly approvedAt?: Date;
  readonly note?: string;
}
