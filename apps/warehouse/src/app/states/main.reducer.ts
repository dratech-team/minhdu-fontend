import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MenuEnum, WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { createReducer, on } from '@ngrx/store';
import { MainAction } from './main.action';


export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialMain = adapter.getInitialState({
  tab: MenuEnum.WAREHOUSE_SUPPLIES,
  warehouse: WarehouseTypeEnum.MEDICINE
});
export const MainReducer = createReducer(
  initialMain,
  on(MainAction.updateState, (state, { tab, warehouse }) => {
    return { ...state, tab: tab ? tab : state.tab, WAREHOUSE: warehouse ? warehouse : state.warehouse };
  })
);
