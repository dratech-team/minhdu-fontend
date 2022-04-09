import {BaseConsignmentEntity} from '../bases';
import {IoiReceiptEntity} from "../../IOI-receipt/entities";

export interface ConsignmentEntity extends BaseConsignmentEntity {
  readonly stocks?: IoiReceiptEntity[];
}
