import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MenuHrConstant} from "../../../shared/constants";
import {AppStore} from "../../state/app.store";
import {AppQuery} from "../../state/app.query";
import {NzModalService} from "ng-zorro-antd/modal";
import {PermanentSalaryComponent} from "../../../shared/components/permamnent-salary/permanent-salary.component";
import {SalaryTypeEnum} from "@minhdu-fontend/enums";

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
    private readonly modal: NzModalService,
  ) {
  }

  onUpdateStateAppName(appName: string, href: string) {
    this.router.navigate([href]).then()
    this.appStore.update(state => ({
      ...state, appName: appName
    }))
  }

  test() {
    this.modal.create({
      nzTitle:'Tạo lương cơ bản',
      nzContent:PermanentSalaryComponent,
      nzComponentParams:{
        data: {type: SalaryTypeEnum.BASIC}
      },
      nzFooter:null,
    })
  }
}
