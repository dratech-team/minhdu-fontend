import {CurrencyUnit} from '@minhdu-fontend/enums';
import {RouteEntity} from '../../route/entities/route.entity';
import {Province} from '@minhdu-fontend/data-models';
import {CustomerEntity} from '../../customer/entities';
import {CommodityEntity} from '../../commodity/entities';
import {BaseEntity} from "@minhdu-fontend/base-entity";

export interface BaseOrderEntity extends BaseEntity{
  customer: CustomerEntity;
  createdAt: Date;
  commodityTotal: number;
  paymentTotal: number;
  deliveredAt?: Date;
  commodities: CommodityEntity[];
  currency: CurrencyUnit;
  routes: RouteEntity[];
  province: Province;
  endedAt: Date;
}
