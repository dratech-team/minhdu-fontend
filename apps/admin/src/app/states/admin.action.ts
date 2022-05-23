import {createAction, props} from '@ngrx/store';
import {MenuAdminEnum} from "../../enums/menu-admin.enum";

export const updateStateMenu = createAction(
  '[UPDATE_STATE_ADMIN] Update State Admin',
  props<{ tab: MenuAdminEnum }>()
);

export const AdminAction = {
  updateStateMenu
}
