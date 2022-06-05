import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { AccountState, AccountStore } from './account.store';

@Injectable({providedIn: 'root'})
export class AccountQuery extends QueryEntity<AccountState> {
  constructor(protected store: AccountStore) {
    super(store);
  }

  getCurrentUser = () => this.getEntity(this.getValue().active);

  selectCurrentUser$ = () => this.select(state => this.getEntity(state.active));
}
