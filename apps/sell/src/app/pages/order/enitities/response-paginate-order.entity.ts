import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseOrderEntity } from './base-order.entity';
import { CommodityUniq } from '../../commodity/entities';

export type ResponsePaginateOrderEntity = ResponsePaginate<BaseOrderEntity> & { commodityUniq: CommodityUniq[] };
