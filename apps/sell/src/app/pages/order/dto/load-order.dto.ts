import { OrderEntity } from '../enitities/order.interface';

export interface LoadOrderDto extends Omit<Partial<OrderEntity>, 'createdAt' | 'deliveredAt'> {
  readonly take: number;
  readonly skip: number;
  readonly customerId?: number;
  readonly deliveredAt?: {
    startedAt: Date,
    endedAt: Date,
  } | Date;
  readonly createdAt?: {
    startedAt: Date,
    endedAt: Date,
  } | Date | string;
  status?: 0 | 1;
  filterRoute?: boolean,
  orderBy?: string,
  orderType?:string,
}
