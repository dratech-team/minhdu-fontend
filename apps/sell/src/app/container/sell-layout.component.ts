import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-mobile/pick-menu.component';
import { document } from 'ngx-bootstrap/utils';
import { AuthActions } from '@minhdu-fontend/auth';
import { Store } from '@ngrx/store';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { LogoutComponent } from 'libs/auth/src/lib/components/dialog-logout.component/logout.component';
import { RegisterComponent } from 'libs/auth/src/lib/components/dialog-register.component/register.component';
import { Router } from '@angular/router';
import { Role } from 'libs/enums/hr/role.enum';


@Component({
  selector: 'app-dashboard',
  templateUrl: './sell-layout.component.html',
  styleUrls: ['./sell-layout.component.scss']
})
export class SellLayoutComponent implements OnInit {
  role = localStorage.getItem('role');
  roleEnum = Role;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly router: Router
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

  changeTab(event: any) {

    const btnHeader = document.getElementsByClassName('btn-header');
    for (let i = 0; i < btnHeader.length; i++) {
      btnHeader[i].classList.remove('btn-border');
    }
    if (event instanceof HTMLImageElement) {
      event.parentElement?.classList.add('btn-border');
    } else {
      event.classList.add('btn-border');
    }
  }

  logout() {
    const ref = this.dialog.open(LogoutComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(AuthActions.logout());
      }
    });
  }

  signUp() {
    this.dialog.open(RegisterComponent, { width: '40%' });
  }
}
