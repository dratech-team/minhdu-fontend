import { createAction, props } from '@datorama/akita-ng-effects';
import { LoadOneSettingRankDto } from '../../dto/setting-rank/load-one-setting-rank.dto';
import { AddSettingBonusDto } from '../../dto/setting-bonus/add-setting-bonus.dto';
import { SearchSettingBonusDto } from '../../dto/setting-bonus/search-setting-bonus.dto';
import { UpdateSettingBonusDto } from '../../dto/setting-bonus/update-setting-bonus.dto';
import { RemoveSettingBonusDto } from '../../dto/setting-bonus/remove-setting-bonus.dto';

const addOne = createAction(
  '[SETTING_BONUS] Add One',
  props<AddSettingBonusDto>()
);

const loadAll = createAction(
  '[SETTING_BONUS] Load All',
  props<SearchSettingBonusDto>()
);

const loadOne = createAction(
  '[SETTING_BONUS] Load One',
  props<LoadOneSettingRankDto>()
);

const update = createAction(
  '[SETTING_BONUS] Update',
  props<UpdateSettingBonusDto>()
);

const remove = createAction(
  '[SETTING_BONUS] Remove',
  props<RemoveSettingBonusDto>()
);

const error = createAction('[SETTING_BONUS] Error', props<{ error: string }>());

export const SettingBonusActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
