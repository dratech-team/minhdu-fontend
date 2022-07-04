import { CommodityEntity } from '../../commodity/entities';

export interface OrderHistoryEntity {
  id: number;
  commodityId: number;
  commodity: CommodityEntity;
  price: number;
  amount: number;
  gift: number;
  more: number;
  confirmedAt: Date;
  note: string;
  timestamp: Date;
}
