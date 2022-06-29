import { BaseIoiReceiptEntity } from '../bases';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';

interface BaseSearchIoiReceiptDto extends BaseIoiReceiptEntity {}

export type SearchIoiReceiptDto = BaseSearchDto<BaseSearchIoiReceiptDto>;
