import { Commodity } from '../entities/commodity.entity';

export interface CreateCommodityDto extends Omit<Commodity, 'id' | 'more' | 'orders'> {
  readonly more: number;
}
