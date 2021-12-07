import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { SystemHistory } from './system-history.model';
import { SystemHistoryActions } from './system-history.actions';

export const adapter: EntityAdapter<SystemHistory> = createEntityAdapter<SystemHistory>();

export const initialSystemHistory = adapter.getInitialState({ loaded: false, total: 0 });

export const SystemHistoryReducer = createReducer(
  initialSystemHistory,
  on(SystemHistoryActions.loadSystemHistorySuccess, (state, action) =>
    adapter.setAll(action.systemHistory, { ...state, loaded: true, total: action.total })
  ),
  on(SystemHistoryActions.loadMoreSystemHistorySuccess, (state, action) =>
    adapter.addMany(action.systemHistory, { ...state, loaded: true, total: action.total })
  )
);

export const {
  selectAll,
  selectEntities,
  selectTotal
} = adapter.getSelectors();
