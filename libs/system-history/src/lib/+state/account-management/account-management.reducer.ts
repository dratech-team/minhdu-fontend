import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AccountManagementActions } from './account-management.actions';
import { Account } from './account.model';


export const adapter: EntityAdapter<Account> = createEntityAdapter<Account>();

export const initialAccount = adapter.getInitialState({ loaded: false });

export const AccountManagementReducer = createReducer(
  initialAccount,
  on(AccountManagementActions.loadInitSuccess, (state, action) =>
    adapter.setAll(action.accounts, { ...state, loaded: true })
  ),
  on(AccountManagementActions.loadMoreAccountSuccess, (state, action) =>
    adapter.addMany(action.accounts, { ...state, loaded: true })
  )
);

export const {
  selectAll,
  selectEntities,
  selectTotal,
} = adapter.getSelectors();
