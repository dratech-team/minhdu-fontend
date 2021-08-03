import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMedicine } from '../../+state/medicine.selector';
import { loadMedicineInit, MedicineAction } from '../../+state/medicine.action';
import { Router } from '@angular/router';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { AppState } from '../../../../../reducers';

@Component({
  selector:'app-medicine',
  templateUrl:'medicine.component.html',

})
export class MedicineComponent implements OnInit{
  medicines$ = this.store.pipe(select(selectorAllMedicine))
  medicineWarehouse = WarehouseTypeEnum.MEDICINE
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
    }
  );
  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {

    this.store.dispatch(MedicineAction.loadMoreMedicines({take: 30, skip :0}))
  }
  detailMedicine() {
    this.router.navigate(['kho-thuoc/chi-tiet-thuoc']).then()
  }

  importMedicine() {

  }
}
