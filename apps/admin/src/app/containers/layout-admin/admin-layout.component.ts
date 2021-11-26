import { Component, OnInit } from '@angular/core';
import { AuthActions } from '@minhdu-fontend/auth';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MenuAdminConstant } from '../../../constant/menu-admin.constant';
import { selectedTab } from '../../states/admin.selector';


@Component({
  selector: 'app-admin-layout',
  templateUrl: 'admin-layout.component.html',
  styleUrls: ['admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  menuAdminConstant = MenuAdminConstant;
  tab$ = this.store.pipe(select(selectedTab));
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    // if (!this.role){
    //   this.router.navigate(['/']).then();
    // }
    this.tab$.subscribe(val => console.log(val) )

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
