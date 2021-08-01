import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMedicine } from '../../+state/medicine.selector';
import { MedicineAction } from '../../+state/medicine.action';
import { Router } from '@angular/router';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl:'medicine.component.html',
})
export class MedicineComponent implements OnInit{
  medicines$ = this.store.pipe(select(selectorAllMedicine))
  medicineWarehouse = WarehouseTypeEnum.MEDICINE
  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    document.getElementById('medicine')!.classList.add('btn-border')
    this.store.dispatch(MedicineAction.loadInit({take: 30, skip :0}))
  }

  detailMedicine() {
    this.router.navigate(['kho-thuoc/chi-tiet-thuoc']).then()
  }
}
