import {CustomerEntity} from '../entities';
import {CustomerType} from "@minhdu-fontend/enums";

export interface AddCustomerDto extends Omit<CustomerEntity, 'id' | 'delivered' | 'delivering' | 'paymentHistories' | 'province' | 'district' | 'ward' | 'Type'> {
  readonly provinceId: number;
  readonly districtId?: number;
  readonly wardId?: number;
  readonly customerType?: CustomerType;
}
