import { RouteEntity } from '../entities/route.entity';

export interface AddRouteDto extends Partial<Omit<RouteEntity, 'id'>> {
  readonly orderIds: number[],
  readonly commodityIds: number[]
}
