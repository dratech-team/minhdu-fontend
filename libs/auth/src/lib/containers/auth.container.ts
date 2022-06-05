import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {App} from '@minhdu-fontend/enums';
import {MatDialog} from '@angular/material/dialog';
import {Localhost} from '../../../../enums/localhost.enum';
import {Actions} from "@datorama/akita-ng-effects";
import {AccountActions} from "../../../../system/src/lib/state/account-management/account.actions";
import {AccountQuery} from "../../../../system/src/lib/state/account-management/account.query";
import {appConstant} from "@minhdu-fontend/constants";

@Component({
  templateUrl: 'auth.container.html'
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  loginning$ = this.accountQuery.select(state => state.loginning)
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
    if (this.loginForm.invalid) {
      return;
    }
    const host = `${window.location.host}`
    this.actions$.dispatch(
      AccountActions.signIn({
        username: this.f.username.value,
        password: this.f.password.value,
        app: appConstant.find(app => app.localHost === host)?.value
      })
    );
  }
}
