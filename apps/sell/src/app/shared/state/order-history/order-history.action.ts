import { createAction, props } from '@datorama/akita-ng-effects';

const loadAll = createAction(
  '[Order-History] Load All',
  props<{ orderId: number }>()
);


export const OrderHistoryActions = {
  loadAll
}
