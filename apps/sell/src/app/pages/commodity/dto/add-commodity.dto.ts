import {CommodityEntity} from '../entities';

export type AddCommodityDto = Partial<Omit<CommodityEntity, 'id'>>
