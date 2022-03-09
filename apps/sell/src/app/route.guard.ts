import { AppStore } from './state/app.store';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TabEnum } from './state/app.entity';

@Injectable()
export class RouteGuard implements CanActivate, CanActivateChild {

  constructor(
    private appStore: AppStore,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.appStore.update(state => ({ ...state, active: route.routeConfig?.path }));
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
