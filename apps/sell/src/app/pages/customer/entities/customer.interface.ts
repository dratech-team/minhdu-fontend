import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { Bank, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { Order } from '../../order/+state/order.interface';

export interface CustomerEntity {
  id: number,
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
  phone: string,
  birthday: Date,
  gender: Gender,
  type?: CustomerType,
  resource?: CustomerResource,
  workPhone?: string,
  email?: string,
  mst?: string,
  isPotential?: boolean,
  bank?: Bank,
  facebook?: string,
  zalo?: string
  debt?: number,
  delivered: Order[],
  delivering: Order[],
  paymentHistories?: PaymentHistory[],
}
