import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { createReducer, on } from '@ngrx/store';
import { AdminAction } from './admin.action';
import { MenuAdminEnum } from '../../enums/menu-admin.enum';

export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialAdmin = adapter.getInitialState({
  tab: MenuAdminEnum.OVERVIEW,
});
export const AdminReducer = createReducer(
  initialAdmin,
  on(AdminAction.updateStateMenu, (state, { tab }) => {
    return { ...state, tab: tab };
  })
);
