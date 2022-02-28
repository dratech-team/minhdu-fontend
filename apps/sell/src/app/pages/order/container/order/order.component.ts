import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Api, CurrenciesConstant} from '@minhdu-fontend/constants';
import {ConvertBoolean, ItemContextMenu, MenuEnum, PaidType, PaymentType, StatusOrder} from '@minhdu-fontend/enums';
import {ExportService} from '@minhdu-fontend/service';
import {select, Store} from '@ngrx/store';
import {DialogDatePickerComponent} from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {DialogExportComponent} from 'libs/components/src/lib/dialog-export/dialog-export.component';
import {debounceTime, map, tap} from 'rxjs/operators';
import {OrderAction} from '../../+state/order.action';
import {selectedCommodityUniqOrder, selectedOrderLoaded, selectorAllOrders} from '../../+state/order.selector';
import {AppState} from '../../../../reducers';
import {MainAction} from '../../../../states/main.action';
import * as _ from 'lodash';
import {Commodity} from "../../../commodity/+state/commodity.interface";
import {getTotalCommodity} from "../../../../../../../../libs/utils/sell.ultil";
import {CommodityUniq} from "../../+state/order.interface";
import {
  DialogSharedComponent
} from "../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component";

@Component({
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {
  orders$ = this.store.pipe(select(selectorAllOrders));
  loaded$ = this.store.pipe(select(selectedOrderLoaded));
  CommodityUniq$ = this.store.pipe(select(selectedCommodityUniqOrder));
  commodities$ = this.store.select(selectorAllOrders).pipe(
    map(orders => {
      return _.uniqBy(_.flattenDeep(orders.map(order => order.commodities)), 'code');
    })
  );

  ItemContextMenu = ItemContextMenu;
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
    startedAt: new FormControl(),
    endedAt: new FormControl(),
    createStartedAt: new FormControl(),
    createEndedAt: new FormControl(),
    deliveryStartedAt: new FormControl(),
    deliveryEndedAt: new FormControl(),
    deliveredAt: new FormControl(),
    commodityTotal: new FormControl(''),
    ward: new FormControl('')
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly exportService: ExportService
  ) {
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.ORDER}));
    this.store.dispatch(
      OrderAction.loadInit({
        orderDTO: {take: this.pageSize, skip: this.pageIndexInit, status: params.status || 0}
      })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val: any) => {
          this.store.dispatch(
            OrderAction.loadInit({orderDTO: this.order(val)})
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
      OrderAction.loadMoreOrders({orderDTO: this.order(val)})
    );
  }

  order(val: any) {
    const value = Object.assign(JSON.parse(JSON.stringify(val)), {
      skip: this.pageIndexInit,
      take: this.pageSize
    });
    if (!value?.createStartedAt && !value?.createEndedAt) {
      delete value?.createStartedAt;
      delete value?.createEndedAt;
    }

    if (!value?.deliveryStartedAt && !value?.deliveryEndedAt) {
      delete value?.deliveryStartedAt;
      delete value?.deliveryEndedAt;
    }

    if (!value?.startedAt && !value?.endedAt) {
      delete value?.startedAt;
      delete value?.endedAt;
    }

    if (value?.startedAt && !value?.endedAt) {
      value.endedAt = value?.startedAt;
      this.formGroup.get('endedAt')?.patchValue(value.endedAt)
    }
    return value;
  }

  readAndUpdate(id: number, isUpdate: boolean) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id], {
      queryParams: {
        isUpdate: isUpdate
      }
    }).then();
  }

  UpdateOrder($event: any) {
    this.dialog
      .open(DialogDatePickerComponent, {
        width: 'fit-content',
        data: {
          titlePopup: 'Xác Nhận ngày giao hàng',
          title: 'Ngày xác nhận'
        }
      })
      .afterClosed()
      .subscribe((val: any) => {
        if (val) {
          this.store.dispatch(
            OrderAction.updateOrder({
              updateOrderDto: {
                order: {
                  deliveredAt: val.day,
                },
                typeUpdate: 'DELIVERED',
                id: $event.id,
              }
            })
          );
        }
      });
  }

  addOrder() {
    this.router.navigate(['/don-hang/them-don-hang']).then();
  }

  printOrder() {
    const val = this.formGroup.value;
    const order = {
      paidType: val.paidType,
      customer: val.name?.trim(),
      ward: val.ward?.trim(),
      commodityTotal: val.commodityTotal?.trim(),
      explain: val.explain?.trim(),
      startedAt: val.createStartedAt?.trim(),
      endedAt: val.createEndedAt?.trim(),
      status:
        val.deliveredAt === this.statusOrder.DELIVERED
          ? this.convertBoolean.TRUE
          : this.convertBoolean.FALSE
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuất bảng đơn hàng',
        exportType: 'RANGE_DATETIME',
        params: order,
        api: Api.SELL.ORDER.EXPORT_ITEMS
      }
    });
  }

  getTotalCommodity(CommodityUniq: CommodityUniq[]): number {
    return getTotalCommodity(CommodityUniq)
  }

  cancelOrder($event: any) {
    this.store.dispatch(OrderAction.cancelOrder({orderId: $event.id}))
  }

  deleteOrder($event: any) {
    const ref = this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá đơn hàng',
        description: 'Bạn có chắc chắn muốn xoá đơn hàng này vĩnh viễn'
      }
    })
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(OrderAction.deleteOrder({id: $event.id}))
      }
    })
  }
}
