import { BaseSearchDto } from '@minhdu-fontend/base-dto';
import { BaseSettingBonusEntity } from '../../bases/base-setting-bonus.entity';

export interface BaseSearchSettingBonusDto extends BaseSettingBonusEntity {
  rankSettingId: number;
}

export type SearchSettingBonusDto = BaseSearchDto<BaseSearchSettingBonusDto>;
