import { CustomerEntity } from '../entities/customer.interface';

export interface LoadCustomerDto extends Partial<CustomerEntity> {
  readonly skip: number,
  readonly take: number,
}
