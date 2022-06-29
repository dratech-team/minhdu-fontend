import { BaseIoiReceiptEntity } from '../bases';
import { BaseAddDto } from '@minhdu-fontend/base-dto';

interface BaseAddIoiReceiptDto extends BaseIoiReceiptEntity {
  readonly branchId: number;
  readonly consignment?: number;
  readonly productId: number;
  readonly file?: string;
}

export type AddIoiReceiptDto = BaseAddDto<BaseAddIoiReceiptDto>;
