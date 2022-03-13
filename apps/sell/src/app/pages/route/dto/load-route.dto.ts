import { RouteEntity } from '../entities/route.entity';

export interface LoadRouteDto extends Pick<Partial<RouteEntity>, 'name' | 'startedAt' | 'endedAt' | 'driver' | 'bsx' | 'garage'> {
  take: number;
  skip: number;
  orderId?: number;
  status?: number;
}
