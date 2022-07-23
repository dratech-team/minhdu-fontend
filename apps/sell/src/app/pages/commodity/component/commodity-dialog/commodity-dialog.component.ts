import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommodityUnit } from '@minhdu-fontend/enums';
import { CommodityAction, CommodityQuery } from '../../state';
import { CommodityService } from '../../service';
import { Actions } from '@datorama/akita-ng-effects';
import { CommodityTemplateQuery } from '../../../commodity-template/state/commodity-template.query';
import { CommodityTemplateActions } from '../../../commodity-template/state/commodity-template.action';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: 'commodity-dialog.component.html'
})
export class CommodityDialogComponent implements OnInit {
  @Input() data: any;

  loading$ = this.commodityTemplateQuery.selectLoading();
  commodities$ = this.commodityTemplateQuery.selectAll();

  CommodityUnit = CommodityUnit;

  formGroup!: FormGroup;

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modalRef: NzModalRef,
    private readonly service: CommodityService,
    private readonly commodityQuery: CommodityQuery,
    private readonly commodityTemplateQuery: CommodityTemplateQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CommodityTemplateActions.loadAll({}));
    this.formGroup = new FormGroup({
      name: new FormControl<string | undefined>(this.data?.commodity?.name, { validators: Validators.required }),
      code: new FormControl<string | undefined>(this.data?.commodity?.code, { validators: Validators.required }),
      price: new FormControl<number | undefined>(this.data?.commodity?.price, { validators: Validators.required }),
      unit: new FormControl<CommodityUnit>(this.data?.commodity?.unit || CommodityUnit.CON, { validators: Validators.required }),
      amount: new FormControl<number>(this.data?.commodity?.amount, { validators: Validators.required }),
      gift: new FormControl<number>(this.data?.commodity?.gift, { validators: Validators.required }),
      more: new FormControl<number>(this.data?.commodity?.more?.amount, { validators: Validators.required })
    });
  }

  selectCommodity(commodity: any) {
    this.formGroup.get('code')?.patchValue(commodity.code);
    this.formGroup.get('name')?.patchValue(commodity.name);
  }

  onSubmit(logged: boolean) {
    const commodity = this.mapToCommodity(logged);

    if (this.data?.isUpdate) {
      this.actions$.dispatch(
        CommodityAction.update({
          id: this.data.commodity.id,
          updates: commodity
        })
      );
    } else {
      this.actions$.dispatch(CommodityAction.addOne({ body: commodity }));
    }
    this.commodityQuery.select().subscribe((state) => {
      if (!(state.loading && state.error)) {
        this.modalRef.close();
      }
    });
  }

  compare() {
    const commodity = this.data.commodity;
    const value = this.formGroup.value;

    return commodity && commodity.price === value.price &&
      commodity.amount === value.amount &&
      commodity.gift === value.gift &&
      commodity.more === value.more;
  }

  private mapToCommodity(logged?: boolean) {
    const value = this.formGroup.value;
    if (this.compare()) {
      logged = false;
    }
    return {
      closed: this.data.commodity.closed || false,
      orderId: this.data.commodity?.orderId,
      logged: logged,
      code: value.code,
      name: value.name,
      price: value.price,
      amount: value.amount,
      gift: value.gift,
      more: value.more,
      unit: value.unit
    };
  }
}
