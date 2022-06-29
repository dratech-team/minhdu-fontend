import { BaseRankEntity } from '../../bases/base-rank.entity';
import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseSettingRankEntity } from '../../bases/base-setting-rank.entity';

export interface BaseAddSettingRankDto extends BaseSettingRankEntity {
  yearBonusSettingIds: number[];
}

export type AddSettingRankDto = BaseAddDto<BaseAddSettingRankDto>;
