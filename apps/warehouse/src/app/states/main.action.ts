import { createAction, props } from '@ngrx/store';
import { MenuEnum, WarehouseTypeEnum } from '@minhdu-fontend/enums';

export const updateState = createAction(
  '[UPDATE_STATE_MENU] Update State Menu',
  props<{ tab?: MenuEnum, warehouse?:WarehouseTypeEnum}>()
);

export const MainAction = {
   updateState
}
