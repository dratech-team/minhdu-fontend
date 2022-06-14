import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {CommodityUnit} from '@minhdu-fontend/enums';
import {CommodityAction} from '../../+state';
import {CommodityService} from '../../service';
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {Actions} from '@datorama/akita-ng-effects';
import {CommodityQuery} from '../../+state';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {CommodityTemplateQuery} from "../../../commodity-template/state/commodity-template.query";
import {CommodityTemplateActions} from "../../../commodity-template/state/commodity-template.action";

@Component({
  templateUrl: 'commodity-dialog.component.html'
})
export class CommodityDialogComponent implements OnInit {
  @Input() data: any;
  commodities$ = this.commodityTemplateQuery.selectAll();
  CommodityUnit = CommodityUnit;
  formGroup!: FormGroup;
  added$ = this.commodityQuery.select(state => state.added);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modalRef: NzModalRef,
    private readonly service: CommodityService,
    private readonly commodityQuery: CommodityQuery,
    private readonly commodityTemplateQuery: CommodityTemplateQuery,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CommodityTemplateActions.loadAll({}))
    this.formGroup = this.formBuilder.group({
      name: [this.data?.commodity?.name, Validators.required],
      code: [this.data?.commodity?.code, Validators.required],
      price: [this.data?.commodity?.price],
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
      if (this.data?.commodity?.orderId) {
        this.dialog.open(DialogSharedComponent, {
          width: 'fit-content',
          data: {
            title: 'Lịch sử cập nhât hàng hoá',
            description: 'bạn có muốn ghi lại lịch sử chỉnh sửa cho đơn hàng này ko'
          }
        }).afterClosed().subscribe(val => {
          if (val) {
            Object.assign(commodity, {histored: true});
          }
          Object.assign(commodity, {
            closed: this.data.commodity.closed || false,
            orderId: this.data.commodity?.orderId
          });
          this.actions$.dispatch(
            CommodityAction.update({
              id: this.data.commodity.id,
              updates: commodity
            })
          );
        });
      } else {
        this.actions$.dispatch(
          CommodityAction.update({
            id: this.data.commodity.id,
            updates: commodity
          })
        );
      }
    } else {
      this.actions$.dispatch(
        CommodityAction.addOne({body: commodity})
      );
    }
    this.added$.subscribe(added => {
      if (added) {
        this.modalRef.close();
      }
    });
  }
}
