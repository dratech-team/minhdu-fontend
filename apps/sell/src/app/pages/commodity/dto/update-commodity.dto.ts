import {CommodityEntity} from '../entities';

export interface updateCommodityDto extends Partial<Omit<CommodityEntity, 'id'>>{
  readonly orderId?: number
}
