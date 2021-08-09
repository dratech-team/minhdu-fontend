import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  selector:'app-main-dashboard',
  templateUrl:'dashboard.component.html',
})
export class DashboardComponent implements OnInit{
  warehouseTypeEnum = WarehouseTypeEnum
  warehouseType = this.warehouseTypeEnum.MEDICINE
  ngOnInit() {
    document.getElementById('main-warehouse')!.classList.add('btn-border')
    // document.getElementById('dashboard-warehouse')!.classList.add('btn-border')
  }

  import() {

  }
}
