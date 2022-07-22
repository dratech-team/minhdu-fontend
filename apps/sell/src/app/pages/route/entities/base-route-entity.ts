import { BaseEntity } from '@minhdu-fontend/base-entity';
import { OrderEntity } from '../../order/enitities/order.entity';
import { CommodityEntity } from '../../commodity/entities';
import { Employee } from '@minhdu-fontend/data-models';

export interface BaseRouteEntity extends BaseEntity {
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
}
