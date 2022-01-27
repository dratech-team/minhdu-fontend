import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { CommodityAction } from '../../+state/commodity.action';
import { AppState } from '../../../../reducers';

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
    console.log(this.data)
    this.formGroup = this.formBuilder.group({
      name: [this.data?.commodity?.name, Validators.required],
      code: [this.data?.commodity?.code, Validators.required],
      price: [this.data?.commodity?.price, Validators.required],
      unit: [this.data?.commodity?.unit || CommodityUnit.CON, Validators.required],
      amount: [this.data?.commodity?.amount, Validators.required],
      gift: [this.data?.commodity?.gift, Validators.required],
      more: [this.data?.commodity?.more?.amount, Validators.required],
    });
  }
  onSubmit() {
    const value = this.formGroup.value;
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
