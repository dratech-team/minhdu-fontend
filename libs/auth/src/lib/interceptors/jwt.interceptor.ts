import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, isDevMode} from '@angular/core';
import {envDev, envProd} from '@minhdu-fontend/environment';
import {Observable} from 'rxjs';
import {Api} from '@minhdu-fontend/constants';
import {catchError, retry} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url

    const token = localStorage.getItem('token');
    const environment = isDevMode() ? envDev : envProd;
    const url = !request.url.startsWith(Api.SLACK_WEBHOOK)
      ? (request.url.split('/')[0] === Api.HR.PAYROLL.PAYROLL
      ? environment.environment.subApiUrl
      : environment.environment.apiUrl) + request.url
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
      request = request.clone({url});
    }
    request = request.clone({url});
    console.log(request);
    return next.handle(request).pipe(
      catchError(err => retry(5))
    );
  }
}
