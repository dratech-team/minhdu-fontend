import { BaseAddDto } from '@minhdu-fontend/base-dto';
import { BaseSettingBonusEntity } from '../../bases/base-setting-bonus.entity';

export interface BaseAddSettingBonusDto extends BaseSettingBonusEntity {
  form: number;
  to: number;
  price: number;
  rankSettingId: number;
}

export type AddSettingBonusDto = BaseAddDto<BaseAddSettingBonusDto>;
