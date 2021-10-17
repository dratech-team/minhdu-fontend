import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formAccountManagement from './account-management.reducer';
import { EntityState } from '@ngrx/entity';
import { Account } from './account.model';

export interface AccountState extends EntityState<Account> {
  loaded: boolean;
  selectedAccount: number;
}

export const selectorAccountState = createFeatureSelector<AccountState>(
  FeatureName.ACCOUNT
);

export const selectorAccountEntities = createSelector(
  selectorAccountState,
  formAccountManagement.selectEntities
);
export const selectorAllAccount = createSelector(
  selectorAccountState,
  formAccountManagement.selectAll
);

export const selectedAccountLoaded = createSelector(
  selectorAccountState,
  (state) => state.loaded
);

export const selectorAccountTotal = createSelector(
  selectorAccountState,
  formAccountManagement.selectTotal
);
