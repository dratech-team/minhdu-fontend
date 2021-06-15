import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectLoggedIn = createSelector(selectAuthState, (user) => !!user);

export const selectLoginLoading = createSelector(selectAuthState, (auth) => {
  return auth.loading;
});
