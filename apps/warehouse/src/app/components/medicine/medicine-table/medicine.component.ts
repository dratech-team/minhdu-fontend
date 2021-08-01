import { Component, Input, OnInit } from '@angular/core';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { Medicine } from '../../../pages/medicine-dashboard/+state/medicine.interface';
import { MatDialog } from '@angular/material/dialog';
import { ImportMedicineComponent } from '../import-medicine-dialog/import-medicine.component';
import { ExportMedicineComponent } from '../export-medicine-dialog/export-medicine.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-medicine',
  templateUrl: 'medicine.component.html'
})
export class MedicineComponent implements OnInit {
  @Input() warehouseType!: WarehouseTypeEnum;
  @Input() medicine: Medicine[] = [];
  warehouseTypeEnum = WarehouseTypeEnum;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
  }

  importMedicine() {
    this.dialog.open(ImportMedicineComponent, { width: '40%' });
  }

  exportMedicine() {
    this.dialog.open(ExportMedicineComponent, { width: '40%' });
  }

  detailMedicine() {
    if (this.warehouseType) {
      this.router.navigate(['kho-thuoc/chi-tiet-thuoc']).then();
    } else {
      this.router.navigate(['chi-tiet-thuoc']).then();
    }
  }
}
