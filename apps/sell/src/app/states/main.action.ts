import { createAction, props } from '@ngrx/store';
import { MenuSellEnum } from '@minhdu-fontend/enums';

export const updateStateMenu = createAction(
  '[UPDATE_STATE_MENU] Update State Menu',
  props<{ tab: MenuSellEnum }>()
);

export const MainAction = {
  updateStateMenu
}
