import {StockEntity} from "./stock.entity";

export interface AttachmentEntity{
  id: number,
  file: string,
  stock: StockEntity,
}
