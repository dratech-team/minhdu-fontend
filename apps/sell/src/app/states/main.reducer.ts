import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MenuEnum } from '@minhdu-fontend/enums';
import { createReducer, on } from '@ngrx/store';
import { MainAction } from './main.action';


export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialMain = adapter.getInitialState({ tab: MenuEnum.HOME,});
export  const  MainReducer = createReducer(
  initialMain,
  on(MainAction.updateStateMenu, (state, {tab}) => {
    return {...state, tab: tab }
  })
)
