import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from '../state/app.store';
import { AppQuery } from '../state/app.query';
import { MenuWarehouseConstant } from '../../shared/constant';
import { Actions } from '@datorama/akita-ng-effects';
import { AccountActions } from '../../../../../libs/system/src/lib/state/account-management/account.actions';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AccountQuery } from '../../../../../libs/system/src/lib/state/account-management/account.query';
import { Role } from '@minhdu-fontend/enums';

@Component({
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss']
})
export class WarehouseLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  roleEnum = Role;
  menuWarehouse = MenuWarehouseConstant;
  appName$ = this.appQuery.select((state) => state.appName);
  routerActive$ = this.appQuery.select((state) => state.active);

  constructor(
    private readonly dialog: MatDialog,
    private readonly appQuery: AppQuery,
    private readonly appStore: AppStore,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly accountQuery: AccountQuery
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
    this.modal.warning({
      nzTitle: 'Đăng xuất',
      nzContent: 'Bạn có chắc chắn muốn đăng xuất',
      nzOnOk: (_) => {
        const currentUser = this.accountQuery.getCurrentUser();
        if (currentUser) {
          return this.actions$.dispatch(
            AccountActions.signOut({
              id: currentUser.id
            })
          );
        } else {
          this.router.navigate(['auth/login']).then();
        }
      }
    });
  }

  signUp() {
    this.dialog.open(RegisterComponent, { width: '40%' });
  }

  onUpdateStateAppName(appName: string, href: string) {
    this.router.navigate([href]).then();
    this.appStore.update((state) => ({
      ...state,
      appName: appName
    }));
  }
}
