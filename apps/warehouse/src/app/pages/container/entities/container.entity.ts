import {BaseContainerEntity} from '../bases';
import {StockEntity} from "../../stock/entities";
import {ProductEntity} from "../../product/entities";

export interface ContainerEntity extends BaseContainerEntity {
  readonly stocks: StockEntity[];
  readonly productId: ProductEntity["id"]
}
