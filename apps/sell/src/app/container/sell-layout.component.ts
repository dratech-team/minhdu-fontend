import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-mobile/pick-menu.component';
import { document } from 'ngx-bootstrap/utils';
import { AuthActions } from '@minhdu-fontend/auth';
import { Store } from '@ngrx/store';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { LogoutComponent } from 'libs/auth/src/lib/components/logout.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './sell-layout.component.html',
  styleUrls: ['./sell-layout.component.scss']
})
export class SellLayoutComponent{
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
  ) {
  }

  pickMenuMobile(){

    this.dialog.open(PickMenuComponent, {width: '100%'})
  }

  setting() {
   this.dialog.open(DevelopmentComponent , {width:'25%'})
  }

  changeTab(event: any) {

      const btnHeader = document.getElementsByClassName('btn-header')
      for (let i = 0; i < btnHeader.length; i++) {
        btnHeader[i].classList.remove('btn-border')
      }
    if(event instanceof HTMLImageElement){
      event.parentElement?.classList.add('btn-border')
    }else{
      event.classList.add('btn-border')
    }
  }
  logout() {
    const ref = this.dialog.open(LogoutComponent,{width:'30%'});
    ref.afterClosed().subscribe(val =>
    {
      if(val){
        this.store.dispatch(AuthActions.logout());
      }
    })
  }
}
