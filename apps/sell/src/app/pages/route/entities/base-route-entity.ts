import { BaseEntity } from '@minhdu-fontend/base-entity';
import { CommodityEntity, CommodityUniq } from '../../commodity/entities';
import { Employee } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/enitities';

export interface BaseRouteEntity extends BaseEntity {
  readonly orders: OrderEntity[];
  readonly driver: string;
  readonly employee: Employee;
  readonly garage?: string;
  readonly latitude: string;
  readonly longitude: string;
  readonly name: string;
  readonly startedAt: Date | string;
  readonly endedAt: Date | string | null;
  readonly commodities: CommodityEntity[];
  readonly bsx: string;
  readonly commodityUniq: CommodityUniq[];
}
