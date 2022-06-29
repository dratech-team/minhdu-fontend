import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { envDev, envProd } from '@minhdu-fontend/environment';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { catchError, retry } from 'rxjs/operators';
import { AccountQuery } from '../../../../system/src/lib/state/account-management/account.query';
import { Router } from '@angular/router';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private readonly accountQuery: AccountQuery,
    private readonly router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url

    const token = this.accountQuery.getCurrentUser()?.token;
    const environment = isDevMode() ? envDev : envProd;
    const url = !request.url.startsWith(Api.SLACK_WEBHOOK)
      ? environment.environment.apiUrl + request.url
      : request.url;
    if (
      token ||
      request.url === VersionEnum.V1 + Api.SIGN_UP ||
      request.url === VersionEnum.V1 + Api.SIGN_IN
    ) {
      request = request.clone({
        url,
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        headers: new HttpHeaders({
          'x-api-key': environment.environment.apiKey,
        }),
      });
    } else {
      this.router.navigate(['auth/login']).then();
      request = request.clone({ url });
    }
    request = request.clone({ url });
    console.log(request);
    return next.handle(request);
  }
}
