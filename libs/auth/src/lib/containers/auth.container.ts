import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthActions, AuthState, selectLoginLoading } from '@minhdu-fontend/auth';
import { Store } from '@ngrx/store';
import { App } from '@minhdu-fontend/enums';
import { MatDialog } from '@angular/material/dialog';
import { Localhost } from '../../../../enums/localhost.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'auth.container.html'
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  loading$ = this.store.select(selectLoginLoading);
  appEnum = App;
  localhost = Localhost;
  constructor(
    private formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly store: Store<AuthState>
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
    this.store.dispatch(
      AuthActions.login({
        username: this.f.username.value,
        password: this.f.password.value,
        app: app
      })
    );
  }
}
