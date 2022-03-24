import {CustomerEntity} from '../entities/customer.entity';

export interface LoadCustomerDto extends Partial<CustomerEntity> {
  readonly skip: number,
  readonly take: number,
  orderBy?: string,
  orderType?: string
}
