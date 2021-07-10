import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommodityUnit, CurrencyUnit } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { CommodityAction } from '../../container/+state/commodity.action';

@Component({
  templateUrl: 'commodity-dialog.component.html'
})
export class CommodityDialogComponent implements OnInit{
  formGroup!: FormGroup;
  commodityUnit = CommodityUnit;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
  ) {
  }
  ngOnInit() {
    this.formGroup = this.formBuilder.group(
      {
        name: [this?.data?.name, Validators.required],
        code: [this?.data?.code, Validators.required],
        price: [this?.data?.price, Validators.required],
        unit: [this?.data?.unit, Validators.required],
        amount: [this?.data?.amount, Validators.required],
      }
    )
  }
  onSubmit(){
    const value =  this.formGroup.value;
    const commodity = {
      code: value.code,
      name: value.name,
      price: value.price,
      unit: value.unit,
      amount: value.amount,
    }
    if(this.data){
      this.store.dispatch(CommodityAction.updateCommodity({ id: this.data.id, commodity: commodity,}))
    }else{
      this.store.dispatch(CommodityAction.addCommodity({commodity: commodity}))
    }
  }
}
