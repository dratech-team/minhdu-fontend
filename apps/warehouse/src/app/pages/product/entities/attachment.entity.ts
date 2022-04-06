import {ProductEntity} from "./product.entity";

export interface AttachmentEntity{
  id: number,
  file: string,
  stock: ProductEntity,
}
