import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthActions, AuthState, selectLoginLoading } from '@minhdu-fontend/auth';
import { Store } from '@ngrx/store';
import { App } from '@minhdu-fontend/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'auth.container.html'
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  loading$ = this.store.select(selectLoginLoading);
  appEnum = App;
  constructor(
    private formBuilder: FormBuilder,
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
    console.log(host);
    const app = host === 'localhost:4000'? this.appEnum.HR:
                  host === 'localhost:4001'?this.appEnum.SELL:
                    host === 'localhost:4002'? this.appEnum.WAREHOUSE: '';
    this.store.dispatch(
      AuthActions.login({
        username: this.f.username.value,
        password: this.f.password.value,
        app: app
      })
    );
  }
}
