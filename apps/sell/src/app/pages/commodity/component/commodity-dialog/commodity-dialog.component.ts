import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommodityUnit} from '@minhdu-fontend/enums';
import {CommodityAction} from '../../+state/commodity.action';
import {CommodityService} from '../../service/commodity.service';
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {Actions} from '@datorama/akita-ng-effects';
import {CommodityQuery} from "../../+state/commodity.query";

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
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly dialogRef: MatDialogRef<CommodityDialogComponent>,
    private readonly service: CommodityService,
    private readonly commodityQuery: CommodityQuery,
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
        });
        ref.afterClosed().subscribe(val => {
          if (val) {
            Object.assign(commodity, {histored: true, orderId: this.data.orderId});
          }
          this.actions$.dispatch(
            CommodityAction.update({
              id: this.data.commodity.id,
              updateCommodityDto: commodity,
            })
          );
        });
      }
    } else {
      this.actions$.dispatch(
        CommodityAction.addOne(commodity)
      );
    }
    this.commodityQuery.select(state => state.added).subscribe(added => {
      if (added) {
        this.dialogRef.close();
      }
    })
  }
}
