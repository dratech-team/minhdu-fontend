import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseRateConditionEntity } from '../../bases/base-rate-condition.entity';

export type BaseSearchRateConditionDto = BaseRateConditionEntity;

export type SearchRateConditionDto = BaseSearchDto<BaseSearchRateConditionDto>;
