import { BaseConsignmentEntity } from '../bases';
import { IoiReceiptEntity } from '../../ioi-receipt/entities';

export interface ConsignmentEntity extends BaseConsignmentEntity {
  readonly stocks?: IoiReceiptEntity[];
}
