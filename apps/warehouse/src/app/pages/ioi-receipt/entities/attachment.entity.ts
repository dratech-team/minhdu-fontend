import {IoiReceiptEntity} from "./ioi-receipt.entity";

export interface AttachmentEntity{
  id: number,
  file?: string,
  stock?: IoiReceiptEntity,
}
