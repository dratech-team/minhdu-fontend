import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseSettingRankEntity } from '../../bases/base-setting-rank.entity';

export interface BaseSearchSettingRankDto extends BaseSettingRankEntity {
  yearBonusSettingIds: number[];
}

export type SearchSettingRankDto = BaseSearchDto<BaseSearchSettingRankDto>;
