import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { AppStore } from './state/app.store';

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate, CanActivateChild {
  constructor(private appStore: AppStore) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    this.appStore.update((state) => ({
      ...state,
      active: route.routeConfig?.path,
    }));
    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
