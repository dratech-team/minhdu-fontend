import {CustomerResource, CustomerType, Gender} from '@minhdu-fontend/enums';

export interface SearchCustomerEntity {
  resource?: CustomerResource,
  isPotential: number,
  customerType: CustomerType,
  gender: Gender,
  search: string,
}
