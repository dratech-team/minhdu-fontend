import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-mobile/pick-menu.component';
import { DevelopmentComponent } from '../../../../../libs/components/src/lib/development/development.component';
import { document } from 'ngx-bootstrap/utils';
import { login } from '@minhdu-fontend/auth';


@Component({
  selector: 'app-dashboard',
  templateUrl: './sell-layout.component.html',
  styleUrls: ['./sell-layout.component.scss']
})
export class SellLayoutComponent{
  constructor(
    private readonly dialog: MatDialog,
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
}
