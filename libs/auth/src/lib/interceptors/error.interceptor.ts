import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Actions} from "@datorama/akita-ng-effects";
import {AccountActions} from "../../../../system/src/lib/state/account-management/account.actions";
import {AccountQuery} from "../../../../system/src/lib/state/account-management/account.query";

@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly accountQuery: AccountQuery
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if ([401].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          // chuyển sang dùng store đã logout được khi chưa đăng nhập
          const currentUser = this.accountQuery.getCurrentUser();
          if (currentUser) {
            this.actions$.dispatch(AccountActions.logout({id: currentUser.id}));
          }
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
