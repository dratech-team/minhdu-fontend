import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '@minhdu-fontend/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { App } from '@minhdu-fontend/enums';


@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      map((actions) => actions),
      switchMap((payload) =>
        this.authService
          .signIn(payload.username, payload.password , payload.app)
          .pipe(map((user) => AuthActions.loginSuccess({ user })))
      ),
      catchError((err) => throwError(err))
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((user) => {
          console.log(user);
          localStorage.setItem('role', user.user.role);
          localStorage.setItem('token', user.user.token);
          switch( user.user.app) {
            case App.HR:
              this.router.navigate(['/nhan-su']).then();
              break;
            case App.SELL:
              this.router.navigate(['/ban-hang']).then();
              break;
            case App.WAREHOUSE:
              this.router.navigate(['/kho']).then();
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
          this.router.navigate(['/auth/signin']).then((r: boolean) => console.log(r));
        })
      ),
    { dispatch: false }
  );
}
