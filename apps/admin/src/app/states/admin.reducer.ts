import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MenuEnum } from '@minhdu-fontend/enums';
import { createReducer, on } from '@ngrx/store';
import { AdminAction } from './admin.action';


export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialAdmin = adapter.getInitialState({ tab: MenuEnum.OVERVIEW_SELL});
export  const  AdminReducer = createReducer(
  initialAdmin,
  on(AdminAction.updateStateMenu, (state, {tab}) => {
    console.log(tab)
    return {...state, tab: tab }
  })
)
