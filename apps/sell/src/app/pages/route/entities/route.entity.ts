import { Employee } from '@minhdu-fontend/data-models';
import { BaseRouteEntity } from './base-route-entity';

export interface RouteEntity extends BaseRouteEntity {
  readonly driver: string;
  readonly employee: Employee;
  readonly garage: string;
  readonly latitude: string;
  readonly longitude: string;
  isSelect?: boolean;
  readonly totalCommodity: number;
  readonly expand: boolean;
  readonly commodityUniq: {
    code: string,
    name: string,
    amount: number,
  }[];
}
