import { PaymentType } from '@minhdu-fontend/enums';
import { CustomerEntity } from '../../customer/entities';
import { CommodityEntity } from '../../commodity/entities';
import { BaseBillEntity } from './base-bill.entity';

export interface BillEntity extends BaseBillEntity {
  readonly customer: CustomerEntity;
  readonly paidAt: Date;
  readonly paidTotal: number;
  readonly payType: PaymentType;
  readonly commodities: CommodityEntity[];
  readonly debt: number;
}
