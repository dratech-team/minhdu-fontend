import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { CommodityAction } from '../../+state/commodity.action';

@Component({
  templateUrl: 'commodity-dialog.component.html'
})
export class CommodityDialogComponent implements OnInit{
  formGroup!: FormGroup;
  commodityUnit = CommodityUnit;
  numberChars = new RegExp('[^0-9]', 'g')
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
        gift: [this?.data?.gift, Validators.required],
        more: [this?.data?.more, Validators.required],
      }
    )
  }
  onSubmit(){
    const value =  this.formGroup.value;
    const commodity = {
      code: value.code,
      name: value.name,
      price: typeof(value.price) === 'string'?Number(value.price.replace(this.numberChars, '')): value.price ,
      amount: typeof(value.amount) === 'string'?Number(value.amount.replace(this.numberChars, '')): value.amount ,
      gift: typeof(value.gift) === 'string'?Number(value.gift.replace(this.numberChars, '')): value.gift ,
      more: typeof(value.more) === 'string'?Number(value.more.replace(this.numberChars, '')): value.more ,
      unit: value.unit,
    }
    if(this.data){
      this.store.dispatch(CommodityAction.updateCommodity({ id: this.data.id, commodity: commodity,}))
    }else{
      this.store.dispatch(CommodityAction.addCommodity({commodity: commodity}))
    }
  }
}
