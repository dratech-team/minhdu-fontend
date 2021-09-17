import { createAction, props } from '@ngrx/store';
import { SystemHistory } from './system-history.model';


export const loadSystemHistory = createAction(
  '[LOAD_HISTORY] Load System History',
  props<{
    take: number,
    skip: number,
  }>()
);

export const loadSystemHistorySuccess = createAction(
  '[LOAD_HISTORY] Load System History Success',
  props<{ systemHistory: SystemHistory[] }>()
);

export const loadMoreSystemHistory = createAction(
  '[LOAD_HISTORY] Load System History',
  props<{
    take: number,
    skip: number,
  }>()
);

export const loadMoreSystemHistorySuccess = createAction(
  '[LOAD_HISTORY] Load System History Success',
  props<{ systemHistory: SystemHistory[] }>()
);

export const SystemHistoryActions = {
  loadSystemHistory,
  loadSystemHistorySuccess,
  loadMoreSystemHistory,
  loadMoreSystemHistorySuccess
};
