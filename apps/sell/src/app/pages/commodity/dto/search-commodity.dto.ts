import { Commodity } from '../entities/commodity.entity';

export interface SearchCommodityDto extends Pick<Commodity, 'code' | 'name'> {
  take: number,
  skip: number,
}
