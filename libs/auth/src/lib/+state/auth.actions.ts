import { createAction, props } from '@ngrx/store';

export const signUp = createAction(
  '[Auth/API] Sign Up',
  props<{ username: string; password: string ;app: string; role: string; employeeId?: number}>()
);

export const signUpSuccess = createAction(
  '[Auth/API] Sign Up success',
  props<{user:any}>()
);

export const login = createAction(
  '[Auth/API] User Login',
  props<{ username: string; password: string ; app: string}>()
);

export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: any }>()
);

export const loginFail = createAction(
  '[Auth/API]  Login Fail',
);

export const logout = createAction('[Auth/PAGE] User Logout');

export const AuthActions = { login, loginSuccess, logout, signUp, signUpSuccess ,loginFail};
