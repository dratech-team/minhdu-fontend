import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MenuEnum } from '@minhdu-fontend/enums';
import { createReducer, on } from '@ngrx/store';
import { OverviewHrAction } from './admin.action';


export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialAdmin = adapter.getInitialState({ tab: MenuEnum.OVERVIEW});
export  const  OverviewHrReducer = createReducer(
  initialAdmin,
  on(OverviewHrAction.updateStateMenu, (state, {tab}) => {
    return {...state, tab: tab }
  })
)
