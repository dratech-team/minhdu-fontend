import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthActions } from '@minhdu-fontend/auth';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MenuAdminConstant } from '../../../constant/menu-admin.constant';
import { AdminAction } from '../../states/admin.action';
import { MenuWarehouseEum } from '@minhdu-fontend/enums';
import { selectedTab } from '../../states/admin.selector';
import { AppState } from '../../reducers';


@Component({
  selector: 'app-admin-layout',
  templateUrl: 'admin-layout.component.html',
  styleUrls: ['admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, AfterContentChecked {
  role = localStorage.getItem('role');
  menuAdminConstant = MenuAdminConstant;
  tab$ = this.store.pipe(select(selectedTab));

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private ref: ChangeDetectorRef
  ) {
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  ngOnInit() {
  }

  logout() {
    const ref = this.dialog.open(LogoutComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(AuthActions.logout());
      }
    });
  }
}
