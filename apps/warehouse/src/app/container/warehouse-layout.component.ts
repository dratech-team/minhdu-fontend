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

  onListWarehouse() {
    let listWarehouse = document.getElementById('warehouse')
    if(listWarehouse?.classList.contains('hide-on-pc')){
      listWarehouse?.classList.remove('hide-on-pc')
      listWarehouse?.classList.add('show')

    }else{
      listWarehouse?.classList.add('hide-on-pc')
      listWarehouse?.classList.remove('show')
    }

  }
}
