import { BaseStockEntity } from '../bases';
import { BaseUpdateDto } from '@minhdu-fontend/base-dto';

interface BaseUpdateStockDto extends BaseStockEntity {}

export type UpdateStockDto = BaseUpdateDto<BaseUpdateStockDto>;
