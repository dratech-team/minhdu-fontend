import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-mobile/pick-menu.component';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { Router } from '@angular/router';
import { Role } from 'libs/enums/hr/role.enum';
import { menuSell } from '@minhdu-fontend/constants';
import { AppQuery } from '../state/app.query';
import { map } from 'rxjs/operators';
import { AccountActions } from '../../../../../libs/system/src/lib/state/account-management/account.actions';
import { Actions } from '@datorama/akita-ng-effects';
import { AccountQuery } from '../../../../../libs/system/src/lib/state/account-management/account.query';

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
    private readonly dialog: MatDialog,
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

  pickMenuMobile() {
    this.dialog.open(PickMenuComponent, { width: '100%' });
  }

  setting() {
    this.dialog.open(DevelopmentComponent, { width: '25%' });
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
    const ref = this.dialog.open(LogoutComponent, { width: '30%' });
    ref.afterClosed().subscribe((val) => {
      if (val) {
        const currentUser = this.accountQuery.getCurrentUser();
        if (currentUser) {
          this.actions$.dispatch(
            AccountActions.logout({
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
}
