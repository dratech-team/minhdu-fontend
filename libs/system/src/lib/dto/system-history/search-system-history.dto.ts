import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseSystemHistoryEntity } from '../../base/base-system-history.entity';

export interface BaseSearchSystemHistoryDto extends BaseSystemHistoryEntity {}

export type SearchSystemHistoryDto = BaseSearchDto<BaseSearchSystemHistoryDto>;
