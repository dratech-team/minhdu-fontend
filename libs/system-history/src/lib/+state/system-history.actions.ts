import { createAction, props } from '@ngrx/store';
import { SystemHistory } from './system-history.model';


export const loadSystemHistory = createAction(
  '[LOAD_HISTORY] Load System History',
  props<{
    take: number,
    skip: number,
    id?:number,
    appName?: string,
    name?:string,
    activity?: string,
    description?: string,
    ip?: string,
    createdAt?: Date
  }>()
);

export const loadSystemHistorySuccess = createAction(
  '[LOAD_HISTORY] Load System History Success',
  props<{ systemHistory: SystemHistory[], total: number }>()
);

export const loadMoreSystemHistory = createAction(
  '[LOAD_HISTORY] Load More System History',
  props<{
    take: number,
    skip: number,
    id?:number,
    appName?: string,
    name?:string,
    activity?: string,
    description?: string,
    ip?: string,
    createdAt?: Date
  }>()
);

export const loadMoreSystemHistorySuccess = createAction(
  '[LOAD_HISTORY] Load More System History Success',
  props<{ systemHistory: SystemHistory[], total: number }>()
);

export const SystemHistoryActions = {
  loadSystemHistory,
  loadSystemHistorySuccess,
  loadMoreSystemHistory,
  loadMoreSystemHistorySuccess
};
