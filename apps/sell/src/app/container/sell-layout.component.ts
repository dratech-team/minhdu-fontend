import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-mobile/pick-menu.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './sell-layout.component.html',
  styleUrls: ['./sell-layout.component.scss']
})
export class SellLayoutComponent {
  constructor(
    private readonly dialog: MatDialog,
  ) {
  }
  pickMenuMobile(){
    this.dialog.open(PickMenuComponent, {width: '100%'})
  }
}
