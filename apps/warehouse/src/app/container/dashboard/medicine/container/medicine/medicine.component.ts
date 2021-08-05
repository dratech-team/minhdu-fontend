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
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';

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

  importMedicine() {
      this.dialog.open(MedicineDialogComponent, {width: '45%'})
  }

  onScroll() {

  }

  exportMedicine() {

  }

  deleteMedicine($event: any){
    console.log($event)
     const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'})
      ref.afterClosed().subscribe(val =>
      {
        if(val){
          this.store.dispatch(MedicineAction.deleteMedicine({medicineId : $event.id}))
        }
      })
  }
  updateMedicine(medicine: Medicine){
    this.dialog.open(MedicineDialogComponent,
      {
        width:'45%',
        data: medicine
      })
  }
}
