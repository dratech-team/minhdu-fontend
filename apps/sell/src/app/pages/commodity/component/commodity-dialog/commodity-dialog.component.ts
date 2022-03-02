import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommodityUnit} from '@minhdu-fontend/enums';
import {Store} from '@ngrx/store';
import {CommodityAction} from '../../+state/commodity.action';
import {AppState} from '../../../../reducers';
import {CommodityService} from '../../service/commodity.service';
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";

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
    private readonly dialog: MatDialog,
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
      unit: value.unit,
      closed: this.data?.orderId ? this.data.commodity.closed : false
    };
    if (this.data?.isUpdate) {
      if (this.data?.orderId) {
        const ref = this.dialog.open(DialogSharedComponent, {
          width: 'fit-content',
          data: {
            title: 'Lịch sử cập nhât hàng hoá',
            description: 'bạn có muốn ghi lại lịch sử chỉnh sửa cho đơn hàng này ko'
          }
        })
        ref.afterClosed().subscribe(val => {
          if (val) {
            Object.assign(commodity, {histored: true})
          }
          this.store.dispatch(
            CommodityAction.updateCommodity({
              id: this.data.commodity.id,
              commodity: commodity,
              orderId: this.data.orderId
            })
          );
          this.dialogRef.close();
        })
      }
    } else {
      this.store.dispatch(
        CommodityAction.addCommodity({commodity: commodity})
      );
      this.dialogRef.close();
    }
  }
}
