import { createAction, props } from '@datorama/akita-ng-effects';
import { AddAccountDto } from '../../dto/account/add-account.dto';
import { SearchAccountDto } from '../../dto/account/search-account.dto';
import { LoadOneAccountDto } from '../../dto/account/load-one-account.dto';
import { UpdateAccountDto } from '../../dto/account/update-account.dto';
import { RemoveAccountDto } from '../../dto/account/remove-account.dto';
import { SignInDto } from '../../dto/account/sign-in.dto';
import { AccountEntity } from '../../entities/account.entity';

const addOne = createAction('[ACCOUNT] Add One', props<AddAccountDto>());

const loadAll = createAction(
  '[ACCOUNT] Load All',
  props<SearchAccountDto>()
);

const loadOne = createAction(
  '[ACCOUNT] Load One',
  props<LoadOneAccountDto>()
);

const signIn = createAction('[ACCOUNT] Sign In', props<SignInDto>());

const update = createAction(
  '[ACCOUNT] Update',
  props<UpdateAccountDto>()
);

const updatePassword = createAction(
  '[ACCOUNT] Update Password',
  props<UpdateAccountDto>()
);

const remove = createAction(
  '[ACCOUNT] Remove',
  props<RemoveAccountDto>()
);

const signOut = createAction(
  '[ACCOUNT] signOut',
  props<{ id: AccountEntity['id'] }>()
);

const error = createAction('[ACCOUNT] Error', props<{ err: string }>());

export const AccountActions = {
  addOne,
  loadAll,
  loadOne,
  signIn,
  update,
  updatePassword,
  remove,
  signOut,
  error
};
