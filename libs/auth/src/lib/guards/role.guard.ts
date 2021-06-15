import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private readonly router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data.expectedRole;
    const role = localStorage.getItem('role');
    if (role !== expectedRole) {
      window.alert(
        'Bạn không có quyền truy cập vào mục này. Vui lòng liên hệ quản lý'
      );
      return false;
    } else {
      return true;
    }
  }
}
