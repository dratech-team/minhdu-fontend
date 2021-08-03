import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMedicines } from '../../+state/medicine.selector';
import {  MedicineAction } from '../../+state/medicine.action';
import { Router } from '@angular/router';
import { MedicineUnit, WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MedicineDialogComponent } from '../../component/medicine-dialog/medicine-dialog.component';
import { Medicine } from '../../+state/medicine.interface';

@Component({
  selector:'app-medicine',
  templateUrl:'medicine.component.html',

})
export class MedicineComponent implements OnInit{
  medicines$ = this.store.pipe(select(selectorAllMedicines))
  medicineWarehouse = WarehouseTypeEnum.MEDICINE
  medicineUnit = MedicineUnit;
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
    }
  );
  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {

    this.store.dispatch(MedicineAction.loadInit({take: 30, skip :0}))
  }
  detailMedicine() {
    this.router.navigate(['kho-thuoc/chi-tiet-thuoc']).then()
  }

  importMedicine() {
      this.dialog.open(MedicineDialogComponent, {width: '45%'})
  }

  onScroll() {

  }

  exportMedicine() {

  }
  updateMedicine(medicine: Medicine){
    this.dialog.open(MedicineDialogComponent,
      {
        width:'45%',
        data: medicine
      })
  }
}
