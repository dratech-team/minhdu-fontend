import { createAction, props } from '@ngrx/store';
import { MenuEnum } from '@minhdu-fontend/enums';

export const updateStateMenu = createAction(
  '[UPDATE_STATE_ADMIN] Update State Admin',
  props<{ tab: MenuEnum }>()
);

export const AdminAction = {
  updateStateMenu
}
