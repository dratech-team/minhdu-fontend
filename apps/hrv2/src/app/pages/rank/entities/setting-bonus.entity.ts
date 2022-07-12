import { BaseSettingBonusEntity } from '../bases/base-setting-bonus.entity';
import { SettingRankEntity } from './setting-rank.entity';

export interface SettingBonusEntity extends BaseSettingBonusEntity {
  rankSetting: SettingRankEntity;
  total: number;
}
