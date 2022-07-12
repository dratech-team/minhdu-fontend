import { CustomerEntity } from '../entities';

export interface ModalCustomerData {
  update?: {
    customer: CustomerEntity;
  };
}
