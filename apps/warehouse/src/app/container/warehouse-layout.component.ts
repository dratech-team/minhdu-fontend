import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PickMenuComponent } from '../components/pick-menu-moibile/pick-menu.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'warehouse-layout.component.html',
  styleUrls: ['warehouse-layout.component.scss']
})
export class WarehouseLayoutComponent {
  constructor(
    private readonly dialog: MatDialog,
  ) {
  }
  pickMenuMobile(){
    this.dialog.open(PickMenuComponent, {width: '100%'})
  }
}
