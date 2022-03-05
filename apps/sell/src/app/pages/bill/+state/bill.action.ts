import { createAction, props } from '@ngrx/store';
import { Bill } from './Bill.interface';


export const loadInit = createAction(
  '[LOAD_BILLS] Load Bill',
  props<{ take: number, skip: number }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_BILLS] Load Bill Success',
  props<{ bills: Bill[] }>()
);

export const loadMoreBills = createAction(
  '[LOAD_MORE_BILLS] Load More Bill',
  props<{ take: number, skip: number }>()
);

export const loadMoreBillsSuccess = createAction(
  '[LOAD_MORE_BILLS] Load More Bill Success',
  props<{ bills: Bill[] }>()
);
export const BillAction = {
  loadInit,
  loadInitSuccess,
  loadMoreBills,
  loadMoreBillsSuccess
};
