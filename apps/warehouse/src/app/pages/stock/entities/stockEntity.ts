import { BaseStockEntity } from '../bases';
import { IoiReceiptEntity } from '../../ioi-receipt/entities';
import { ProductEntity } from '../../product/entities';

export interface StockEntity extends BaseStockEntity {
  readonly ioiReceipt: IoiReceiptEntity[];
  readonly productId: ProductEntity['id'];
}
