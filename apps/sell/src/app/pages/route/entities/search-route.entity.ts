import {RangeDay} from '@minhdu-fontend/data-models';

export interface SearchRouteEntity {
  search: string,
  startedAt: RangeDay,
  endedAt: RangeDay,
  status: number
}
