import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { Store } from '@ngrx/store';
import { CommodityAction } from '../../+state/commodity.action';
import { AppState } from '../../../../reducers';
import { CommodityService } from '../../service/commodity.service';

@Component({
  templateUrl: 'commodity-dialog.component.html'
})
export class CommodityDialogComponent implements OnInit {
  formGroup!: FormGroup;
  CommodityUnit = CommodityUnit;

  commodities$ = this.service.getTemplate();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly dialogRef: MatDialogRef<CommodityDialogComponent>,
    private readonly service: CommodityService
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [this.data?.commodity?.name, Validators.required],
      code: [this.data?.commodity?.code, Validators.required],
      price: [this.data?.commodity?.price, Validators.required],
      unit: [this.data?.commodity?.unit || CommodityUnit.CON, Validators.required],
      amount: [this.data?.commodity?.amount, Validators.required],
      gift: [this.data?.commodity?.gift, Validators.required],
      more: [this.data?.commodity?.more?.amount, Validators.required]
    });
  }

  selectCommodity(commodity: any) {
    this.formGroup.get('code')?.patchValue(commodity.code);
    this.formGroup.get('name')?.patchValue(commodity.name);
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
      unit: value.unit
    };
    if (this.data?.isUpdate) {
      this.store.dispatch(
        CommodityAction.updateCommodity({
          id: this.data.commodity.id,
          commodity: commodity
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
