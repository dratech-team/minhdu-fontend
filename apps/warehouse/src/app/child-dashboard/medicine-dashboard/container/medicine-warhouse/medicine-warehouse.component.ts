import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMedicine } from '../../+state/medicine.selector';
import { MedicineAction } from '../../+state/medicine.action';
import { Router } from '@angular/router';

@Component({
  selector:'app-medicine-dashboard',
  templateUrl:'medicine-warehouse.component.html',
})
export class MedicineWarehouseComponent implements OnInit{
  medicines$ = this.store.pipe(select(selectorAllMedicine))
  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    this.store.dispatch(MedicineAction.loadInit({take: 30, skip :0}))
  }

  importMedicine() {

  }

  detailMedicine() {
    this.router.navigate(['kho-thuoc/chi-tiet-thuoc']).then()
  }
}
