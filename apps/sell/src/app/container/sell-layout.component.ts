import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { Router } from '@angular/router';
import { Role } from 'libs/enums/hr/role.enum';
import { menuSell } from '@minhdu-fontend/constants';
import { AppQuery } from '../state/app.query';
import { map } from 'rxjs/operators';
import { AccountActions } from '../../../../../libs/system/src/lib/state/account-management/account.actions';
import { Actions } from '@datorama/akita-ng-effects';
import { AccountQuery } from '../../../../../libs/system/src/lib/state/account-management/account.query';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './sell-layout.component.html',
  styleUrls: ['./sell-layout.component.scss']
})
export class SellLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  roleEnum = Role;
  menuSell = menuSell;
  tab$ = this.appQuery
    .select((state) => state.active)
    .pipe(map((active) => '/' + active));

  constructor(
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly appQuery: AppQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    // if (!this.role) {
    //   this.router.navigate(['/']).then();
    // }
  }

  development() {
    this.message.warning('Chức năng đang phát triển');
  }

  // changeTab(event: any) {
  //
  //   const btnHeader = document.getElementsByClassName('btn-header');
  //   for (let i = 0; i < btnHeader.length; i++) {
  //     btnHeader[i].classList.remove('btn-border');
  //   }
  //   if (event instanceof HTMLImageElement) {
  //     event.parentElement?.classList.add('btn-border');
  //   } else {
  //     event.classList.add('btn-border');
  //   }
  // }

  logout() {
    this.modal.warning({
      nzTitle: 'Đăng xuất',
      nzContent: 'Bạn có chắc chắn muốn đăng xuất?',
      nzOnOk: () => {
        const currentUser = this.accountQuery.getCurrentUser();
        if (currentUser) {
          this.actions$.dispatch(
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
    this.modal.create({
      nzContent: RegisterComponent,
      nzFooter: null
    });
  }
}
