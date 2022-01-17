import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api, CurrenciesConstant } from '@minhdu-fontend/constants';
import {
  ConvertBoolean,
  MenuEnum,
  PaymentType,
  StatusOrder
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { select, Store } from '@ngrx/store';
import { DialogDatePickerComponent } from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { DialogExportComponent } from 'libs/components/src/lib/dialog-export/dialog-export.component';
import { PaidType } from 'libs/enums/paidType.enum';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';
import { debounceTime, tap } from 'rxjs/operators';
import { OrderAction } from '../../+state/order.action';
import {
  selectedOrderLoaded,
  selectorAllOrders
} from '../../+state/order.selector';
import { AppState } from '../../../../reducers';
import { MainAction } from '../../../../states/main.action';

@Component({
  templateUrl: 'order.component.html',
})
export class OrderComponent implements OnInit {
  pageTypeEnum = PageTypeEnum;
  paidType = PaidType;
  statusOrder = StatusOrder;
  currenciesConstant = CurrenciesConstant;
  convertBoolean = ConvertBoolean;
  payType = PaymentType;
  pageSize = 40;
  pageIndexInit = 0;
  formGroup = new FormGroup({
    paidType: new FormControl(''),
    name: new FormControl(''),
    status: new FormControl(0),
    explain: new FormControl(''),
    createdAt: new FormControl(''),
    commodityTotal: new FormControl(''),
    destination: new FormControl(''),
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly exportService: ExportService
  ) {}

  orders$ = this.store.pipe(select(selectorAllOrders));
  loaded$ = this.store.pipe(select(selectedOrderLoaded));

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.ORDER }));
    this.store.dispatch(
      OrderAction.loadInit({
        orderDTO: { take: this.pageSize, skip: this.pageIndexInit },
      })
    );
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            OrderAction.loadInit({ orderDTO: this.order(val) })
          );
        })
      )
      .subscribe();
  }

  add() {
    this.router.navigate(['don-hang/them-don-hang']).then();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      OrderAction.loadMoreOrders({ orderDTO: this.order(val) })
    );
  }

  order(val: any) {
    return {
      skip: this.pageIndexInit,
      take: this.pageSize,
      paidType: val.paidType,
      customer: val.name.trim(),
      destination: val.destination.trim(),
      commodityTotal: val.commodityTotal,
      explain: val.explain.trim(),
      createdAt: val.createdAt.trim(),
      status: val.status,
    };
  }

  detailOrder(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  UpdateOrder($event: any) {
    this.dialog
      .open(DialogDatePickerComponent)
      .afterClosed()
      .subscribe((deliveredAt) => {
        this.store.dispatch(
          OrderAction.updateOrder({
            order: { deliveredAt },
            id: $event.id,
            typeUpdate: 'DELIVERED',
          })
        );
      });
  }

  addOrder() {
    this.router.navigate(['/don-hang/them-don-hang']).then();
  }

  printOrder() {
    const val = this.formGroup.value;
    const order = {
      paidType: val.paidType,
      customer: val.name.trim(),
      destination: val.destination.trim(),
      commodityTotal: val.commodityTotal.trim(),
      explain: val.explain.trim(),
      createdAt: val.createdAt.trim(),
      deliveredAt:
        val.deliveredAt === this.statusOrder.DELIVERED
          ? this.convertBoolean.TRUE
          : this.convertBoolean.FALSE,
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuất bảng đơn hàng',
        exportType: 'ORDER',
        params: order,
        api: Api.SELL.ORDER.ORDER_EXPORT,
      },
    });
  }
}
