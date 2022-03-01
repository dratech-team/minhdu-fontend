import { CustomerEntity } from '../entities/customer.entity';

export interface CreateCustomerDto extends Omit<CustomerEntity, "id" | "province" | "district"> {
  
}
