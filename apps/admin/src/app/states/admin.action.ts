import { createAction, props } from '@ngrx/store';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';

export const updateStateMenu = createAction(
  '[UPDATE_STATE_ADMIN] Update State Admin',
  props<{ tab: MenuWarehouseEum }>()
);

export const AdminAction = {
  updateStateMenu
}
