import {Component, OnInit} from '@angular/core';
import {Role} from 'libs/enums/hr/role.enum';
import {Router} from '@angular/router';
import {MenuHrConstant} from "../../../shared/constants";
import {AppStore} from "../../state/app.store";
import {AppQuery} from "../../state/app.query";

@Component({
  templateUrl: './page-layout.component.html',
  styleUrls: ['page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  roleEnum = Role;
  menuWarehouse = MenuHrConstant
  appName$ = this.appQuery.select(state => state.appName)
  routerActive$ = this.appQuery.select(state => state.active)

  constructor(
    private readonly appQuery: AppQuery,
    private readonly appStore: AppStore,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    if (!this.role) {
      this.router.navigate(['/']).then();
    }
  }

  onUpdateStateAppName(appName: string, href: string) {
    this.router.navigate([href]).then()
    this.appStore.update(state => ({
      ...state, appName: appName
    }))
  }
}
