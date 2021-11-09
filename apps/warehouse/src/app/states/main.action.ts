import { createAction, props } from '@ngrx/store';
import { MenuEnum } from '@minhdu-fontend/enums';

export const updateStateMenu = createAction(
  '[UPDATE_STATE_MENU] Update State Menu',
  props<{ tab: MenuEnum }>()
);

export const MainAction = {
  updateStateMenu
}
