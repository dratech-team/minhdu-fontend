import {CustomerEntity} from '../entities';

export interface LoadCustomerDto extends Partial<CustomerEntity> {
  readonly skip: number,
  readonly take: number,
  orderBy?: string,
  orderType?: string
}
