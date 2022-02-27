import { createAction, props } from '@datorama/akita-ng-effects';


const loadInit = createAction(
  '[LOAD_BILLS] Load Bill',
  props<{ take: number, skip: number }>()
);

const loadMoreBills = createAction(
  '[LOAD_MORE_BILLS] Load More Bill',
  props<{ take: number, skip: number }>()
);

export const BillAction = {
  loadInit,
  loadMoreBills
};
