import {BaseConsignmentEntity} from '../bases';
import {StockEntity} from "../../stock/entities";

export interface ConsignmentEntity extends BaseConsignmentEntity {
  readonly stocks: StockEntity[];
}
