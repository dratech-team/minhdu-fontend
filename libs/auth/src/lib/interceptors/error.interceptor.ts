import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthActions, AuthState } from '@minhdu-fontend/auth';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly store: Store<AuthState>,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const role = localStorage.getItem('role');

    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          localStorage.removeItem('role');
          localStorage.removeItem('token');
          this.router.navigate(['auth/login']).then();

          /// FIXME: action not working
          this.store.dispatch(AuthActions.logout());
          return throwError(err);
        } else if ([403].indexOf(err.status) !== -1) {
          this.snackBar.open('Permission denied', 'Đã hiểu', {duration: 2000});
        } else {
          this.snackBar.open('[ FAILURE ]  ' + err?.error?.message, 'Đóng', {duration: 2000});
        }
        const error = err?.error?.message || err?.statusText;
        return throwError(error);
      })
    );
  }
}
