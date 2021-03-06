import { AttachmentEntity } from './attachment.entity';
import { ProductEntity } from '../../product/entities';
import { ConsignmentEntity } from '../../consignment/entities';
import { Branch } from '@minhdu-fontend/data-models';
import { BaseIoiReceiptEntity } from '../bases';

export interface IoiReceiptEntity extends BaseIoiReceiptEntity {
  readonly attachment?: AttachmentEntity;
  readonly product: ProductEntity;
  readonly consignment?: ConsignmentEntity;
  readonly branch?: Branch;
  readonly createdAt: Date;
  readonly tax: number;
}
