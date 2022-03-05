import { CustomerEntity } from '../entities/customer.entity';

export interface AddCustomerDto extends Omit<CustomerEntity, 'id' | 'delivered' | 'delivering' | 'paymentHistories' | 'province' | 'district' | 'ward'> {
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
}
