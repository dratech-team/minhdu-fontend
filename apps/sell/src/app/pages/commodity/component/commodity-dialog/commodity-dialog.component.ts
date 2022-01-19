import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { CommodityAction } from '../../+state/commodity.action';
import { customCurrencyMaskConfig2 } from '@minhdu-fontend/config';

@Component({
  templateUrl: 'commodity-dialog.component.html',
})
export class CommodityDialogComponent implements OnInit {
  formGroup!: FormGroup;
  CommodityUnit = CommodityUnit;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<CommodityDialogComponent>
  ) {}
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [this.data?.name, Validators.required],
      code: [this.data?.code, Validators.required],
      price: [this.data?.price, Validators.required],
      unit: [this.data?.unit || CommodityUnit.CON, Validators.required],
      amount: [this.data?.amount, Validators.required],
      gift: [this.data?.gift, Validators.required],
      more: [this.data?.more.amount, Validators.required],
    });
  }
  onSubmit() {
    const value = this.formGroup.value;
    console.log(value);
    const commodity = {
      code: value.code,
      name: value.name,
      price: value.price,
      amount: value.amount,
      gift: value.gift,
      more: value.more,
      unit: value.unit,
    };
    if (this.data) {
      this.store.dispatch(
        CommodityAction.updateCommodity({
          id: this.data.id,
          commodity: commodity,
        })
      );
    } else {
      this.store.dispatch(
        CommodityAction.addCommodity({ commodity: commodity })
      );
    }
    this.dialogRef.close();
  }
}
