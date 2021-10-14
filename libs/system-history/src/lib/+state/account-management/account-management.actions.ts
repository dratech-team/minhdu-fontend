import { createAction, props } from '@ngrx/store';
import { AccountDTO, Account } from './account.model';


export const loadInit = createAction(
  '[LOAD_ACCOUNT_MANAGEMENT] Load Account Management',
  props<{ accountDTO: AccountDTO }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_ACCOUNT_MANAGEMENT] Load init Success',
  props<{ accounts: Account[] }>()
);

export const loadMoreAccount = createAction(
  '[LOAD_ACCOUNT_MANAGEMENT] Load More Account Management',
  props<{ accountDTO: AccountDTO }>()
);

export const loadMoreAccountSuccess = createAction(
  '[LOAD_ACCOUNT_MANAGEMENT] Load More Account Management Success',
  props<{ accounts: Account[] }>()
);

export const AccountManagementActions = {
  loadInit,
  loadInitSuccess,
  loadMoreAccount,
  loadMoreAccountSuccess
};
