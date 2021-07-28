import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-mobile/pick-menu.component';
import { DevelopmentComponent } from '../../../../../libs/components/src/lib/development/development.component';
import { document } from 'ngx-bootstrap/utils';


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

  changeTab() {
   const btnHeader =document.getElementsByClassName('btn-header')
    for (let i = 0; i < btnHeader.length; i++) {
      console.log(btnHeader[i].target)
      if (!btnHeader[i].target ) {
        btnHeader[i].classList.remove('btn-border')
      }
    }
  }
}
