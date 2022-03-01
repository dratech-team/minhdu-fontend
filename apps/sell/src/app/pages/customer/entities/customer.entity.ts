import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { Bank, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/entities/order.entity';

export interface CustomerEntity {
  id: number,
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
  district?: { id: number, name: string },
  province: { id: number, name: string },
  address: string,
  email?: string,
  religion: string,
  ethnicity: string,
  mst?: string,
  type: CustomerType,
  resource: CustomerResource,
  note?: string,
  delivering: OrderEntity [],
  delivered: OrderEntity [],
  isPotential?: boolean,
  bank: Bank,
  facebook?: string,
  zalo?: string
  isSelect?: boolean,
  debt?: number,
  paymentHistories?: PaymentHistory[],
}
