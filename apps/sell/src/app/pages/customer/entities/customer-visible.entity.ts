import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { Bank, PaymentHistory, Ward } from '@minhdu-fontend/data-models';
import { OrderEntity } from '../../order/enitities/order.interface';
import {VisibleEntity} from "../../order/enitities/order-visible.entity";

export interface CustomerVisibleEntity {
  readonly stt:VisibleEntity,
  readonly name:VisibleEntity,
  readonly phone:VisibleEntity,
  readonly birthday:VisibleEntity,
  readonly gender:VisibleEntity,
  readonly resource:VisibleEntity,
  readonly potential:VisibleEntity,
  readonly customerType:VisibleEntity,
  readonly email:VisibleEntity,
  readonly address:VisibleEntity,
  readonly note:VisibleEntity,
}
