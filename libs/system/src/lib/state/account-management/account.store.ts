import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {AccountEntity} from "../../entities/account.entity";

export interface AccountState extends EntityState<AccountEntity> {
  loading: boolean;
  loginLoading: boolean,
  loadMore: boolean
  added: boolean | null;
  total: number
  search?: Partial<AccountEntity & {search: string}>;
  deleted: boolean | null,
  accountLogged?: AccountEntity,
}

function createInitState(): AccountState {
  return {
    loading: true,
    loginLoading: false,
    loadMore: false,
    added: null,
    total: 0,
    deleted: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.ACCOUNT})
export class AccountStore extends EntityStore<AccountState> {
  constructor() {
    super(createInitState());
  }
}
