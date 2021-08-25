import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
/// TODO: change env to env of libs.
import { environmentAppHr } from 'apps/hr/src/environments/environmentAppHr';
import { environmentAppSell } from 'apps/sell/src/environments/environment';
import { environmentAppWarehouse } from 'apps/warehouse/src/environments/environment';
import { environmentAppAdmin } from 'apps/admin/src/environments/environment';
import { Localhost } from '../../../../enums/localhost.enum';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  localhost = Localhost;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    console.log('requesting...');
    const  app = `${window.location.host}`;

    const token = localStorage.getItem('token');
    const environment = app === this.localhost.APP_HR? environmentAppHr:
                          app === this.localhost.APP_SELL?environmentAppSell:
                            app === this.localhost.APP_WAREHOUSE? environmentAppWarehouse:
                              app === this.localhost.APP_ADMIN?environmentAppAdmin: environmentAppHr;

    const url = environment.apiUrl + request.url;
    if (token !== undefined) {
      request = request.clone({
        url,
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        headers: new HttpHeaders({ 'x-api-key': environment.apiKey })
      });
    } else {
      request = request.clone({ url });
    }
    request = request.clone({ url });
    console.log(request);
    return next.handle(request);
  }
}
