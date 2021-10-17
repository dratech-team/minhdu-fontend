import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '@minhdu-fontend/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AccountManagementActions } from '../../../../system/src/lib/+state/account-management/account-management.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) {
  }

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      switchMap((props) => {
          return this.authService.signUp(props.accountDTO);
        }
      ),
      map((user) => {
          this.snackbar.open('Tọa tài khoản thành công', '', { duration: 1500 });
           this.store.dispatch(AccountManagementActions.loadInit({}))
        return AuthActions.signUpSuccess({user})
        }
      ),
      catchError((err) => throwError(err))
    )
  );



  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateAccount),
      switchMap((props) => {
          return this.authService.updateAccount(props.id, props);
        }
      ),
      map((user) => {
          this.snackbar.open('Cập nhật tài khoản thành công', '', { duration: 1500 });
          return AccountManagementActions.loadInit({});
        }
      ),
      catchError((err) => throwError(err))
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      map((actions) => actions),
      switchMap((payload) =>
        this.authService
          .signIn(payload.username, payload.password, payload.app)
          .pipe(map((user) => AuthActions.loginSuccess({ user })))
      ),
      catchError((err) => {
        this.store.dispatch(AuthActions.loginFail());
        return throwError(err);
      })
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((user) => {
          localStorage.setItem('role', user.user.role);
          localStorage.setItem('token', user.user.token);
          if (user.user) {
            this.router.navigate(['/']).then();
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap((_) => {
          localStorage.removeItem('role');
          localStorage.removeItem('token');
          this.router.navigate(['auth/login']).then();
        })
      ),
    { dispatch: false }
  );
}
