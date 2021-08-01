import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Requisite } from '../../../pages/requisite-dashboard/+state/requisite .interface';
import { MatDialog } from '@angular/material/dialog';
import { ImportRequisiteComponent } from '../import-requisite-dialog/import-requisite.component';
import { ExportRequisiteComponent } from '../export-requisite-dialog/export-requisite.component';
import { Router } from '@angular/router';

@Component({
  selector:'app-requisite',
  templateUrl:'requisite.component.html',
})
export class RequisiteComponent implements OnInit{
  @Input() warehouseType!: WarehouseTypeEnum
  @Input() requisite: Requisite[] = []
  warehouseTypeEnum = WarehouseTypeEnum
  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
  }
  importRequisite() {
    this.dialog.open(ImportRequisiteComponent,{width:'40%'})
  }

  exportRequisite() {
    this.dialog.open(ExportRequisiteComponent,{width:'40%'})
  }

  detailRequisite() {

    if(this.warehouseType){
      this.router.navigate(['kho-van-phong-pham/chi-tiet-van-phong-pham']).then()
    }else{
      this.router.navigate(['chi-tiet-van-phong-pham']).then()
    }

  }
}
