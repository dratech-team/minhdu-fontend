import { createAction, props } from '@ngrx/store';
import { Bill } from './Bill.interface';


const loadInit = createAction(
  '[LOAD_BILLS] Load Bill',
  props<{ take: number, skip: number }>()
);

const loadInitSuccess = createAction(
  '[LOAD_BILLS] Load Bill Success',
  props<{ bills: Bill[] }>()
);

const loadMoreBills = createAction(
  '[LOAD_MORE_BILLS] Load More Bill',
  props<{ take: number, skip: number }>()
);

const loadMoreBillsSuccess = createAction(
  '[LOAD_MORE_BILLS] Load More Bill Success',
  props<{ bills: Bill[] }>()
);

export const BillAction = {
  loadInit,
  loadInitSuccess,
  loadMoreBills,
  loadMoreBillsSuccess
};
