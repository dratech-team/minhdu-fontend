import { BaseCommodityEntity } from './base-commodity.entity';

export type CommodityUniq = Pick<BaseCommodityEntity, 'code' | 'name' | 'amount'>;
