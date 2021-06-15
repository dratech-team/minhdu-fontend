import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../apps/hr/src/environments/environment';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    console.log('requesting...')
    const token = localStorage.getItem('token');
    const url = environment.apiUrl + request.url;
    if (token !== undefined) {
      request = request.clone({
        url,
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        headers: new HttpHeaders({ 'x-api-key': environment.apiKey }),
      });
    } else {
      request = request.clone({ url });
    }
    request = request.clone({ url });
    console.log(request);
    return next.handle(request);
  }
}
