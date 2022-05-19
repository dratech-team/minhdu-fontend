import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MenuAdminConstant} from '../../../constant/menu-admin.constant';
import {Actions} from "@datorama/akita-ng-effects";
import {AccountActions} from "../../../../../../libs/system/src/lib/state/account-management/account.actions";
import {NzModalService} from "ng-zorro-antd/modal";


@Component({
  selector: 'app-admin-layout',
  templateUrl: 'admin-layout.component.html',
  styleUrls: ['admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  menuAdminConstant = MenuAdminConstant;

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private ref: ChangeDetectorRef,
    private modal: NzModalService,
  ) {
  }

  ngOnInit() {
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
}
