import {CommodityEntity} from "../entities/commodity.entity";

export interface updateCommodityDto extends Partial<Omit<CommodityEntity, 'id'>>{
  readonly orderId?: number
}
