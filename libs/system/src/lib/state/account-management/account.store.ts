import {ActiveState, EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {StorageName} from '@minhdu-fontend/constants';
import {AccountEntity} from "../../entities/account.entity";

export interface AccountState extends EntityState<AccountEntity>, ActiveState<AccountEntity["id"]> {
  loading?: boolean;
  total: number
  remain: number
  search?: Partial<AccountEntity & { search: string }>;
}

function createInitState(): AccountState {
  return {
    loading: false,
    total: 0,
    remain: 0,
    active: null
  }
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: StorageName.ACCOUNT})
export class AccountStore extends EntityStore<AccountState> {
  constructor() {
    super(createInitState());
  }
}
