import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '@minhdu-fontend/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { SnackBarComponent } from '../../../../components/src/lib/snackBar/snack-bar.component';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  SignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      map((actions) => actions),
      switchMap((payload) =>
        this.authService
          .signUp(
            payload.username,
            payload.password,
            payload.app,
            payload.role,
            payload?.employeeId
          )
          .pipe(map((user) => AuthActions.signUpSuccess({ user: user })))
      ),
      catchError((err) => throwError(err))
    )
  );

  SignUpSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signUpSuccess),
        map((_) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            panelClass: ['background-snackbar'],
            data: {content: 'Đăng kí tài khoản thành công'}
          });
        }),
        catchError((err) => throwError(err))
      ),
    { dispatch: false }
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
        map((_) => {
          localStorage.removeItem('role');
          localStorage.removeItem('token');
          this.router.navigate(['auth/login']).then();
        })
      ),
    { dispatch: false }
  );
}
