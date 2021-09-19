import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SystemHistory } from './system-history.model';
import { SystemHistoryActions } from './system-history.actions';


export interface SystemHistoryState extends EntityState<SystemHistory> {
  loaded: boolean,
  selectedBillId: number,
}

export const adapter: EntityAdapter<SystemHistory> = createEntityAdapter<SystemHistory>();
export const initialSystemHistory = adapter.getInitialState({ loaded: false });
export const SystemHistoryReducer = createReducer(
  initialSystemHistory,
  on(SystemHistoryActions.loadSystemHistorySuccess, (state, action) =>
    adapter.setAll(action.systemHistory, { ...state, loaded: true})
  ),
  on(SystemHistoryActions.loadMoreSystemHistorySuccess, (state, action) =>
    adapter.addMany(action.systemHistory, { ...state, loaded: true })
  )
);
export const { selectAll, selectEntities } = adapter.getSelectors();
