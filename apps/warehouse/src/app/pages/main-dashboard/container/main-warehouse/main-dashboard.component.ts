import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  selector:'app-main-dashboard',
  templateUrl:'main-dashboard.component.html',
})
export class MainDashboardComponent implements OnInit{
  warehouseTypeEnum = WarehouseTypeEnum
  warehouseType = this.warehouseTypeEnum.MEDICINE
  ngOnInit() {
    document.getElementById('main-warehouse')!.classList.add('btn-border')
  }
  choseWareHouse(TypeWarehouse: WarehouseTypeEnum) {
    switch(TypeWarehouse) {
      case this.warehouseTypeEnum.REQUISITE :
       this.warehouseType = this.warehouseTypeEnum.REQUISITE
        break;
      case this.warehouseTypeEnum.PRODUCT :
        this.warehouseType = this.warehouseTypeEnum.PRODUCT
        break;
      case this.warehouseTypeEnum.APPLIANCE :
        this.warehouseType = this.warehouseTypeEnum.APPLIANCE
        break;
      case this.warehouseTypeEnum.POULTRY_FOOD :
        this.warehouseType = this.warehouseTypeEnum.POULTRY_FOOD
        break;
      case this.warehouseTypeEnum.MEDICINE :
        this.warehouseType = this.warehouseTypeEnum.MEDICINE
        break;
    }
  }
  import() {

  }
}
