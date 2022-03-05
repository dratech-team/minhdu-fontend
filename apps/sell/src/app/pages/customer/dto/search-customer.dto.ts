import { CustomerEntity } from '../entities/customer.interface';

export interface SearchCustomerDto extends CustomerEntity {
  readonly skip: number,
  readonly take: number,
}
