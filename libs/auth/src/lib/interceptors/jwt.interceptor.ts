import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { envDev, envProd } from '@minhdu-fontend/environment';
import { Observable, throwError } from 'rxjs';
import { Localhost } from '../../../../enums/localhost.enum';
import { Api } from '@minhdu-fontend/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly snackBar: MatSnackBar) {
  }

  localhost = Localhost;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const token = localStorage.getItem('token');

    const environment = isDevMode() ? envDev : envProd;

    const url = !request.url.startsWith(Api.SLACK_WEBHOOK)
      ? environment.environment.apiUrl + request.url
      : request.url;
    if (token !== undefined) {
      request = request.clone({
        url,
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        headers: new HttpHeaders({
          'x-api-key': environment.environment.apiKey
        })
      });
    } else {
      request = request.clone({ url });
    }
    request = request.clone({ url });
    console.log(request)
      return next.handle(request).pipe(
        catchError(err => throwError(err))
      );
  }
}
