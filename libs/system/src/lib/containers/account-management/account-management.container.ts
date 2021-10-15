import { Component, OnInit } from '@angular/core';
import { App } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { debounceTime, tap } from 'rxjs/operators';
import {
  selectedAccountLoaded,
  selectorAllAccount
} from '../../+state/account-management/account-management.selectors';
import { AccountManagementActions } from '../../+state/account-management/account-management.actions';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../../../../../auth/src/lib/components/dialog-register.component/register.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'account-management.container.html'
})
export class AccountManagementContainer implements OnInit {
  app = App;
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new FormGroup({
    id: new FormControl(''),
    username: new FormControl(''),
    branch: new FormControl(''),
    role: new FormControl(''),
    loggedAt: new FormControl(''),
    ip: new FormControl(''),
    createdAt: new FormControl('')
  });

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  Accounts$ = this.store.pipe(select(selectorAllAccount));
  loaded$ = this.store.pipe(select(selectedAccountLoaded));

  ngOnInit(): void {
    this.store.dispatch(AccountManagementActions.loadInit(
      { accountDTO: { take: this.pageSize, skip: this.pageIndexInit } }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            AccountManagementActions.loadInit(
              { accountDTO: this.account(val) })
          );
        })
      )
      .subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      AccountManagementActions.loadMoreAccount(
        { accountDTO: this.account(val) }
      )
    );
  }

  account(val: any) {
    return {
      take: this.pageSize,
      skip: this.pageIndexInit,
      id: val.id,
      username: val.username,
      branch: val.branch,
      role: val.role,
      loggedAt: val.loggedAt,
      ip: val.ip,
      createdAt: val.createdAt
    };
  }

  addAccount() {
    this.dialog.open(RegisterComponent, { width: 'fit-content' });
  }

  updateAccount($event: any) {
    this.dialog.open(RegisterComponent, { width: 'fit-content', data: { account: $event, isUpdate: true } });
  }
}
