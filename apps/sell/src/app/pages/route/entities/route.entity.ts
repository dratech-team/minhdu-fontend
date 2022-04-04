import {Employee} from '@minhdu-fontend/data-models';
import {BaseRouteEntity} from "./base-route-entity";

export interface RouteEntity extends BaseRouteEntity {
  readonly id: number,
  readonly driver: string,
  readonly employee: Employee,
  readonly garage: string,
  readonly latitude: string,
  readonly longitude: string,
  isSelect?: boolean,
  readonly totalCommodityUniq: number,
  readonly expand: boolean

}
