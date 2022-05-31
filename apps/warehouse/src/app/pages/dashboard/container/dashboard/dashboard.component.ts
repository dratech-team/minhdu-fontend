import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MenuDashboardConstant} from "../../constants/menu-dashboard.constant";
import {ItemUserManualDashboardConstant} from "../../constants/item-user-manual-dashboard.constant";

@Component({
  templateUrl: 'dashboard.html'
})
export class DashboardComponent {

  menuDashboardConstant = MenuDashboardConstant
  itemManualDashboardConstant = ItemUserManualDashboardConstant

  constructor(
    private readonly router: Router
  ) {
  }


  onRedirect(url: string) {
    this.router.navigate([url]).then()
  }

  onClickItem() {
    //
  }
}
