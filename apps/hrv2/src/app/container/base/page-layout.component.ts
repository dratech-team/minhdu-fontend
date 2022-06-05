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
import {TabEnum} from "../../state/app.entity";
import {NzMessageService} from "ng-zorro-antd/message";
import {AccountQuery} from "../../../../../../libs/system/src/lib/state/account-management/account.query";


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
    private readonly actions$: Actions,
    private readonly message: NzMessageService,
    private readonly accountQuery: AccountQuery
  ) {
  }

  onUpdateStateAppName(appName: string, href: string): any {
    if (href === TabEnum.RANK) {
      return this.message.info('Tính năng đang phát triển')
    }
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
        const currentUser = this.accountQuery.getCurrentUser();
        if (currentUser) {
          return this.actions$.dispatch(AccountActions.logout({
            id: currentUser.id
          }))
        } else {
          this.router.navigate(['auth/login']).then()
        }
      })
    })
  }

  changePassWord() {
    this.modal.create({
      nzWidth: '500px',
      nzTitle: 'Đổi mật khẩu',
      nzContent: ModalChangePasswordComponent,
      nzFooter: []
    })
  }
}
