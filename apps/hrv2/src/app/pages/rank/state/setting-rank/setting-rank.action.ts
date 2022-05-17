import {createAction, props} from '@datorama/akita-ng-effects';
import {AddSettingRankDto} from "../../dto/setting-rank/add-setting-rank.dto";
import {SearchSettingRankDto} from "../../dto/setting-rank/search-setting-rank.dto";
import {LoadOneSettingRankDto} from "../../dto/setting-rank/load-one-setting-rank.dto";
import {UpdateSettingRankDto} from "../../dto/setting-rank/update-setting-rank.dto";
import {RemoveSettingRankDto} from "../../dto/setting-rank/remove-setting-rank.dto";

const addOne = createAction(
  '[SETTING_RANK] Add One',
  props<AddSettingRankDto>()
);

const loadAll = createAction(
  '[SETTING_RANK] Load All',
  props<SearchSettingRankDto>()
);

const loadOne = createAction(
  '[SETTING_RANK] Load One',
  props<LoadOneSettingRankDto>()
);

const update = createAction(
  '[SETTING_RANK] Update',
  props<UpdateSettingRankDto>()
);

const remove = createAction(
  '[SETTING_RANK] Remove',
  props<RemoveSettingRankDto>()
);

const error = createAction(
  '[SETTING_RANK] Error',
  props<{ error: string }>()
);

export const SettingRankActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
