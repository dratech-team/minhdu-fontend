import {createAction, props} from "@datorama/akita-ng-effects";
import {AddAccountDto} from "../../dto/account/add-account.dto";
import {SearchAccountDto} from "../../dto/account/search-account.dto";
import {LoadOneAccountDto} from "../../dto/account/load-one-account.dto";
import {UpdateAccountDto} from "../../dto/account/update-account.dto";
import {RemoveAccountDto} from "../../dto/account/remove-account.dto";
import {SignInDto} from "../../dto/account/sign-in.dto";


export const addOne = createAction(
  '[ACCOUNT] Add One',
  props<AddAccountDto>()
);

export const loadAll = createAction(
  '[ACCOUNT] Load All',
  props<SearchAccountDto>()
);

export const loadOne = createAction(
  '[ACCOUNT] Load One',
  props<LoadOneAccountDto>()
);

export const signIn = createAction(
  '[ACCOUNT] Sign In',
  props<SignInDto>()
);

export const update = createAction(
  '[ACCOUNT] Update',
  props<UpdateAccountDto>()
);

export const updatePassword = createAction(
  '[ACCOUNT] Update Password',
  props<UpdateAccountDto>()
);

export const remove = createAction(
  '[ACCOUNT] Remove',
  props<RemoveAccountDto>()
);

export const logout = createAction(
  '[ACCOUNT] Logout',
);

export const error = createAction(
  '[ACCOUNT] Error',
  props<{err: string}>()
);

export const AccountActions = {
  addOne,
  loadAll,
  loadOne,
  signIn,
  update,
  updatePassword,
  remove,
  logout,
  error
};
