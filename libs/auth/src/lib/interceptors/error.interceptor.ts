import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthActions, AuthState } from '@minhdu-fontend/auth';
import { Api } from '@minhdu-fontend/constants';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly store: Store<AuthState>,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly http: HttpClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
          throw this.snackBar.open('Bạn không có quyền truy cập vào mục này', 'Đã hiểu', {
            duration: 2000,
          });
        }
        const error =
          err?.error?.message ||
          'Lỗi từ server. Vui lòng liên hệ kỹ thuật để được hỗ trợ';
        this.snackBar.open('[ FAILURE ]  ' + error, 'Đóng');

        /// FIXME: Chưa work. (postman đã work). Check mail join channel in slack. Keywork: Slack webhook. Tắt vpn để error rơi vào case này
        this.http
          .post(Api.SLACK_WEBHOOK, {
            username: 'Bug Report',
            text: err?.message.toString() || 'Lỗi Không kết nối được server',
            icon_emoji: ':ladybug:',
          })
          .subscribe((v) => console.log('send report bug to slack', v)).unsubscribe();
        return throwError(error);
      })
    );
  }
}
