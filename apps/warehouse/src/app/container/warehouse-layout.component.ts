import { Component, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import {  Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wareHouse',
  templateUrl: './warehouse-layout.component.html',
  styleUrls: ['./warehouse-layout.component.scss'],
})
export class WarehouseLayoutComponent implements OnInit{

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
  }

  choseWareHouse(TypeWarehouse: WarehouseTypeEnum) {
    // switch(TypeWarehouse) {
    //   case this.warehouseTypeEnum.REQUISITE :
    //    this.warehouseType = this.warehouseTypeEnum.REQUISITE
    //     break;
    //   case this.warehouseTypeEnum.PRODUCT :
    //     this.warehouseType = this.warehouseTypeEnum.PRODUCT
    //     break;
    //   case this.warehouseTypeEnum.APPLIANCES :
    //     this.warehouseType = this.warehouseTypeEnum.APPLIANCES
    //     break;
    //   case this.warehouseTypeEnum.POULTRY_FOOD :
    //     this.warehouseType = this.warehouseTypeEnum.POULTRY_FOOD
    //     break;
    //   case this.warehouseTypeEnum.MEDICINE :
    //     this.router.navigate(['kho-thuoc']).then()
    //     break;
    //   case this.warehouseTypeEnum.MAIN_WAREHOUSE :
    //     this.warehouseType = this.warehouseTypeEnum.MAIN_WAREHOUSE
    //     break;
    // }
  }
  changeTab(event: any) {
    const btnHeader = document.getElementsByClassName('btn-header')
    for (let i = 0; i < btnHeader.length; i++) {
      btnHeader[i].classList.remove('btn-border')
    }
    event.classList.add('btn-border')
  }
}
