import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '@minhdu-fontend/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { App } from '@minhdu-fontend/enums';
import { SnackBarSuccessComponent } from '../../../../components/src/lib/snackBar-success/snack-bar-success.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';


@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) {
  }

  SignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      map((actions) => actions),
      switchMap((payload) =>
        this.authService
          .signUp(payload.username, payload.password, payload.app, payload.role, payload?.employeeId)
          .pipe(map(user => AuthActions.signUpSuccess({ user: user })))
      ),
      catchError((err) => throwError(err))
    )
  );

  SignUpSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.signUpSuccess),
        map((_) => {
          this.snackBar.openFromComponent(SnackBarSuccessComponent, {
            duration: 2500,
            panelClass: ['background-snackbar']
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
          this.store.dispatch(AuthActions.loginFail())
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
          switch (user.user.app) {
            case App.HR:
              this.router.navigate(['/nhan-su']).then();
              break;
            case App.SELL:
              this.router.navigate(['/ban-hang']).then();
              break;
            case App.WAREHOUSE:
              this.router.navigate(['/kho']).then();
              break;
            case App.ADMIN:
              this.router.navigate(['/quan-tri']).then();
              break;
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
          this.router.navigate(['/']).then((r: boolean) => console.log(r));
        })
      ),
    { dispatch: false }
  );
}
