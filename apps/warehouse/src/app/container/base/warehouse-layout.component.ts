import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthActions} from '@minhdu-fontend/auth';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {LogoutComponent} from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import {RegisterComponent} from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import {Role} from 'libs/enums/hr/role.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {AppStore} from "../../state/app.store";
import {AppQuery} from "../../state/app.query";
import {MenuWarehouseConstant} from "../../../shared/constant/menu-warehouse.constant";

@Component({
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss']
})
export class WarehouseLayoutComponent implements OnInit, AfterContentChecked {
  role = localStorage.getItem('role');
  roleEnum = Role;
  menuWarehouse = MenuWarehouseConstant
  appName$ = this.appQuery.select(state => state.appName)
  routerActive$ = this.appQuery.select(state => state.active)

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly appQuery: AppQuery,
    private readonly appStore: AppStore,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    if (!this.role) {
      this.router.navigate(['/']).then();
    }
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  logout() {
    const ref = this.dialog.open(LogoutComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(AuthActions.logout());
      }
    });
  }

  signUp() {
    this.dialog.open(RegisterComponent, { width: '40%' });
  }

  onUpdateStateAppName(appName: string) {
    this.appStore.update(state => ({
      ...state, appName: appName
    }))
  }
}
