import {CommodityEntity} from "../entities/commodity.entity";

export type AddCommodityDto = Partial<Omit<CommodityEntity, 'id'>>
