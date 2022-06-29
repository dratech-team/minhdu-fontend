import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MethodHttp } from '../../../shared/http/method.http';

@Injectable({ providedIn: 'root' })
export class RouteMiddleware implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    switch (req.method) {
      case MethodHttp.GET: {
      }
    }
    return next.handle(req);
  }
}
