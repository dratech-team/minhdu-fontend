import {BaseProductEntity} from '../bases';
import {StockEntity} from "../../stock/entities";

export interface ProductEntity extends BaseProductEntity {
  readonly stocks: StockEntity[];
}
