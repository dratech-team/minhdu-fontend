import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MethodHttp } from '../http/method.http';

export class BaseMiddleware<L, A, U> implements HttpInterceptor {
  intercept(
    req: HttpRequest<L | A | U>,
    next: HttpHandler
  ): Observable<HttpEvent<L | A | U>> {
    switch (req.method) {
      case MethodHttp.GET: {
        // this.getRequest(req.params.);
        break;
      }
      case MethodHttp.POST: {
        break;
      }
      case MethodHttp.PATCH: {
        break;
      }
      case MethodHttp.DELETE: {
        break;
      }
    }
    return next.handle(req);
  }

  load(param: L) {}

  update(param: U) {}

  add(param: A) {}
}
