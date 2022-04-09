import {BaseContainerEntity} from '../bases';
import {IoiReceiptEntity} from "../../IOI-receipt/entities";
import {ProductEntity} from "../../product/entities";

export interface ContainerEntity extends BaseContainerEntity {
  readonly stocks: IoiReceiptEntity[];
  readonly productId: ProductEntity["id"]
}
