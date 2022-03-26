import {
  HttpClient,
  HttpErrorResponse,
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

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          localStorage.removeItem('role');
          localStorage.removeItem('token');
          this.router.navigate(['auth/login']).then();

          /// FIXME: action not working
          this.store.dispatch(AuthActions.logout());
        } else if ([403].indexOf(err.status) !== -1) {
          this.router.navigate(['/he-thong/han-che-truy-cap']).then();
        }
        if (
          err instanceof HttpErrorResponse &&
          err.error instanceof Blob &&
          err.error.type === 'application/json'
        ) {
          return new Promise<any>((_, reject) => {
            let reader = new FileReader();
            reader.onload = (e: Event) => {
              try {
                const errMsg = JSON.parse((<any>e.target).result);
                reject(
                  new HttpErrorResponse({
                    error: errMsg,
                    headers: err.headers,
                    status: err.status,
                    statusText: err.statusText,
                  })
                );
                this.snackBar.open('[ FAILURE ]  ' + errMsg.message, '', {
                  panelClass: 'ddd',
                  duration: 3000,
                });
              } catch (e) {
                reject(err);
              }
            };
            reader.onerror = () => {
              reject(err);
            };
            reader.readAsText(err.error);
          });
        }
        const error =
          err?.error?.message ||
          'Lỗi từ server. Vui lòng liên hệ kỹ thuật để được hỗ trợ';
        this.snackBar.open('[ FAILURE ]  ' + error, '', {
          panelClass: 'ddd',
          duration: 3000,
        });
        return throwError(error);
      })
    );
  }
}
