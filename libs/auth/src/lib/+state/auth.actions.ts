import { createAction, props } from '@ngrx/store';


export const login = createAction(
  '[Auth/API] User Login',
  props<{ username: string; password: string ; app: string}>()
);

export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: any }>()
);

export const logout = createAction('[Auth/PAGE] User Logout');

export const AuthActions = { login, loginSuccess, logout };
