import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MenuHrConstant} from "../../../shared/constants";
import {AppStore} from "../../state/app.store";
import {AppQuery} from "../../state/app.query";
import {NzModalService} from "ng-zorro-antd/modal";
import {AccountActions} from "../../../../../../libs/system/src/lib/state/account-management/account.actions";
import {Actions} from "@datorama/akita-ng-effects";
import {
  ModalChangePasswordComponent
} from "../../../../../../libs/auth/src/lib/components/modal-change-password/modal-change-password.component";


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
    private readonly actions$: Actions
  ) {
  }

  onUpdateStateAppName(appName: string, href: string) {
    this.router.navigate([href]).then()
    this.appStore.update(state => ({
      ...state, appName: appName
    }))
  }

  logout() {
    this.modal.warning({
      nzTitle: 'Đăng xuất',
      nzContent: 'Bạn có chắc chắn muốn đăng xuất',
      nzOnOk: (_ => {
        return this.actions$.dispatch(AccountActions.logout())
      })
    })
  }

  changePassWord() {
    this.modal.create({
      nzWidth:'500px',
      nzTitle:'Đổi mật khẩu',
      nzContent: ModalChangePasswordComponent,
      nzFooter:[]
    })
  }
}
