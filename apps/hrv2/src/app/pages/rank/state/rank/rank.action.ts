import {createAction, props} from '@datorama/akita-ng-effects';
import {AddRankDto} from "../../dto/rank/add-rank.dto";
import {SearchRankDto} from "../../dto/rank/search-rank.dto";
import {LoadOneRankDto} from "../../dto/rank/load-one-rank.dto";
import {UpdateRankDto} from "../../dto/rank/update-rank.dto";
import {RemoveRankDto} from "../../dto/rank/remove-rank.dto";

/**
 * @deprecated
 * thứ hạng xếp loại người dùng không đươc thêm, để addone  phòng trường hợp thay đổi logic
 * */
const addOne = createAction(
  '[RANK] Add One',
  props<AddRankDto>()
);

const loadAll = createAction(
  '[RANK] Load All',
  props<SearchRankDto>()
);


const loadOne = createAction(
  '[RANK] Load One',
  props<LoadOneRankDto>()
);

/**
 * @deprecated
 * thứ hạng xếp loại người dung không được cập nhật , để uopdate  phòng trường hợp thay đổi logic
 * */
const update = createAction(
  '[RANK] Update',
  props<UpdateRankDto>()
);


/**
 * @deprecated
 * thứ hạng xếp loại người dung không được xoá , để remove  phòng trường hợp thay đổi logic
 * */
const remove = createAction(
  '[RANK] Remove',
  props<RemoveRankDto>()
);

const error = createAction(
  '[RANK] Error',
  props<{ error: string }>()
);

export const RankActions = {
  addOne,
  loadAll,
  loadOne,
  update,
  remove,
  error,
};
