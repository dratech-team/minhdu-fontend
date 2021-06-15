import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AuthActions, AuthState } from '@minhdu-fontend/auth';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly store: Store<AuthState>,
    private readonly snackBar: MatSnackBar
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const role = localStorage.getItem('role');

    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          console.log('UnAuthenticate');
          this.store.dispatch(AuthActions.logout());
        } else if ([403].indexOf(err.status) !== -1) {
          this.snackBar.open('Permission denied', 'Đã hiểu');
        } else {
          this.snackBar.open('[ FAILURE ]  ' + err.error.message, 'Đóng');
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
