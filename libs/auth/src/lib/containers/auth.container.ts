import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {App} from '@minhdu-fontend/enums';
import {MatDialog} from '@angular/material/dialog';
import {Localhost} from '../../../../enums/localhost.enum';
import {Actions} from "@datorama/akita-ng-effects";
import {AccountActions} from "../../../../system/src/lib/state/account-management/account.actions";
import {AccountQuery} from "../../../../system/src/lib/state/account-management/account.query";

@Component({
  templateUrl: 'auth.container.html'
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  loading$ = this.accountQuery.select(state => state.loginLoading)
  appEnum = App;
  localhost = Localhost;
  constructor(
    private formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions,
    private readonly accountQuery:  AccountQuery,
  ) {
  }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
  }

  get f(): any {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const host = `${window.location.host}`
    const app = host === this.localhost.APP_HR? this.appEnum.HR:
                  host === this.localhost.APP_SELL?this.appEnum.SELL:
                    host === this.localhost.APP_WAREHOUSE? this.appEnum.WAREHOUSE:
                      host === this.localhost.APP_ADMIN? this.appEnum.ADMIN: '';
    this.actions$.dispatch(
      AccountActions.signIn({
        username: this.f.username.value,
        password: this.f.password.value,
        app: app
      })
    );
  }
}
