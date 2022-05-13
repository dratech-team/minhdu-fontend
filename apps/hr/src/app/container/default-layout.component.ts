import { Component, OnDestroy, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { Role } from 'libs/enums/hr/role.enum';
import { Router } from '@angular/router';
import { DialogChangePassword } from '../../../../../libs/auth/src/lib/components/dialog-change-password/dialog-change-password';
import {Actions} from "@datorama/akita-ng-effects";
import {AccountActions} from "../../../../../libs/system/src/lib/state/account-management/account.actions";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  roleEnum = Role;

  showFiller = false;
  public sidebarMinimized = false;
  public navItems = navItems;
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit() {
    if (!this.role) {
      this.router.navigate(['/']).then();
    }
  }



  toggleMinimize(e: any): void {
    this.sidebarMinimized = e;
  }

  logout() {
    const ref = this.dialog.open(LogoutComponent, { width: '30%' });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        return this.actions$.dispatch(AccountActions.logout());
      }
    });
  }

  signUp() {
    this.dialog.open(RegisterComponent, { width: '40%' });
  }

  changePassword() {
    this.dialog.open(DialogChangePassword, {width:'fit-content',})
  }
}
