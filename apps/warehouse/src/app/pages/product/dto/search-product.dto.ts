import { BaseProductEntity } from '../bases';
import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { Branch } from '@minhdu-fontend/data-models';

export interface BaseSearchProductDto extends BaseProductEntity {
  readonly category?: number;
  readonly supplier?: number;
}

export type SearchProductDto = BaseSearchDto<BaseSearchProductDto>;
