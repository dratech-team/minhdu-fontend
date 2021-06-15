import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

export interface AuthState {
  loading: boolean;
}

export const initAuthState: AuthState = {
  loading: false
};

export const authReducer = createReducer(
  initAuthState,
  on(AuthActions.login, (state, action) => {
    return {
      ...state,
      loading: true
    };
  }),
  on(AuthActions.loginSuccess, (state, action) => {
    return {
      ...action.user,
      loading: false
    };
  })
);
