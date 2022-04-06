import {BaseStockEntity} from '../bases';
import {AttachmentEntity} from "./attachment.entity";

export interface StockEntity extends BaseStockEntity {
  readonly note?: string;
  attechments : AttachmentEntity
}
