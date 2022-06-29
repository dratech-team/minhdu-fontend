import { BaseUpdateDto } from '@minhdu-fontend/base-dto';
import { BaseSettingRankEntity } from '../../bases/base-setting-rank.entity';

export interface BaseUpdateSettingRankDto extends BaseSettingRankEntity {
  yearBonusSettingIds: number[];
}

export type UpdateSettingRankDto = BaseUpdateDto<BaseUpdateSettingRankDto>;
