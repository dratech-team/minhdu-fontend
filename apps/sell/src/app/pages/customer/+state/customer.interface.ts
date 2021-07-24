import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { Bank, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { Order } from '../../order/+state/order.interface';

export interface Customer {
  id: number,
  firstName: string,
  lastName: string,
  avt?: string,
  gender: Gender,
  phone: string,
  workPhone?: string,
  birthday: Date,
  birthplace: string,
  identify: string,
  idCardAt: Date,
  issuedBy: string,
  ward: Ward,
  wardId: number,
  address: string,
  email?: string,
  religion: string,
  ethnicity: string,
  mst?: string,
  type: CustomerType,
  resource: CustomerResource,
  note?: string,
  orders: Order[],
  isPotential?: boolean,
  bank: Bank,
  facebook?: string,
  zalo?: string
  isSelect?: boolean,
  debt?:number,
  paymentHistories?: PaymentHistory[],
}
