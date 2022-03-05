import { createAction, props } from '@ngrx/store';

const loadAll = createAction(
  '[BILL] Load All',
  props<{ take: number, skip: number }>()
);

export const BillAction = {
  loadAll
};
