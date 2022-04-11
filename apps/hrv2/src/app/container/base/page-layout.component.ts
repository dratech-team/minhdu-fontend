import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MenuHrConstant} from "../../../shared/constants";
import {AppStore} from "../../state/app.store";
import {AppQuery} from "../../state/app.query";

@Component({
  templateUrl: './page-layout.component.html',
  styleUrls: ['page-layout.component.scss']
})
export class PageLayoutComponent {
  menuHrConstants = MenuHrConstant
  appName$ = this.appQuery.select(state => state.appName)
  routerActive$ = this.appQuery.select(state => state.active)

  constructor(
    private readonly appQuery: AppQuery,
    private readonly appStore: AppStore,
    private readonly router: Router,
  ) {
  }

  onUpdateStateAppName(appName: string, href: string) {
    this.router.navigate([href]).then()
    this.appStore.update(state => ({
      ...state, appName: appName
    }))
  }
}
