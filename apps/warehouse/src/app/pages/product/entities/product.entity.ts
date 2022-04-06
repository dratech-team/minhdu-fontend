import {BaseProductEntity} from '../bases';
import {AttachmentEntity} from "./attachment.entity";

export interface ProductEntity extends BaseProductEntity {
  readonly note?: string;
  attechments : AttachmentEntity
}
