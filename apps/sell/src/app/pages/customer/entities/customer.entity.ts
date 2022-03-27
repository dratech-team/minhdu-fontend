import { Bank, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/enitities/order.entity';
import {BaseCustomerEntity} from "./base-customer.entity";

export interface CustomerEntity extends BaseCustomerEntity {
  avt?: string,
  lastName: string,
  birthplace: string,
  religion: string,
  ethnicity: string,
  address: string,
  note?: string,
  province: { id: number, name: string },
  district: { id: number, name: string },
  ward: Ward,
  identify?: string,
  idCardAt?: Date,
  issuedBy?: string,
  birthday: Date,
  workPhone?: string,
  email?: string,
  mst?: string,
  bank?: Bank,
  facebook?: string,
  zalo?: string
  debt?: number,
  delivered: OrderEntity[],
  delivering: OrderEntity[],
  paymentHistories?: PaymentHistory[],
}
