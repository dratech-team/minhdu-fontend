import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { CommodityUniq } from '../../commodity/entities';
import { OrderEntity } from './order.entity';

export type ResponsePaginateOrderEntity = ResponsePaginate<OrderEntity> & { commodityUniq: CommodityUniq[] };
