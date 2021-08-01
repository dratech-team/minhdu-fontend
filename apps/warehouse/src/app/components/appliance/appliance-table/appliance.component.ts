import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Appliance } from '../../../pages/appliances-dashboard/+state/appliance.interface';
import { MatDialog } from '@angular/material/dialog';
import { ImportApplianceComponent } from '../import-appliance-dialog/import-appliance.component';
import { ExportApplianceComponent } from '../export-appliance-dialog/export-appliance.component';
import { Router } from '@angular/router';

@Component({
  selector:'app-appliance',
  templateUrl:'appliance.component.html',
})
export class ApplianceComponent implements OnInit{
  @Input() warehouseType!: WarehouseTypeEnum
  @Input() appliance: Appliance[] = []
  warehouseTypeEnum = WarehouseTypeEnum
  constructor(
      private readonly dialog: MatDialog,
      private readonly router: Router,
  ) {
  }
  ngOnInit() {

  }
  importAppliance() {
    const ref = this.dialog.open(ImportApplianceComponent,{width:'40%'})
  }

  exportAppliance() {
    const ref = this.dialog.open(ExportApplianceComponent,{width:'40%'})
  }

  detailAppliance() {
    if(this.warehouseType){
      this.router.navigate(['kho-thiet-bi/chi-tiet-thiet-bi']).then()
    }else{
      this.router.navigate(['chi-tiet-thiet-bi']).then()
    }
  }
}
