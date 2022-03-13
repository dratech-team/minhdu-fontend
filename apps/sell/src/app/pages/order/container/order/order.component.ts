import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Api, CurrenciesConstant} from '@minhdu-fontend/constants';
import {
  ConvertBoolean,
  ItemContextMenu,
  MenuEnum,
  PaidType,
  PaymentType,
  SortOrderEnum,
  StatusOrder
} from '@minhdu-fontend/enums';
import {ExportService} from '@minhdu-fontend/service';
import {DialogDatePickerComponent} from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {DialogExportComponent} from 'libs/components/src/lib/dialog-export/dialog-export.component';
import {debounceTime, map, tap} from 'rxjs/operators';
import {OrderActions} from '../../+state/order.actions';
import * as _ from 'lodash';
import {getTotalCommodity} from '../../../../../../../../libs/utils/sell.ultil';
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {Actions} from '@datorama/akita-ng-effects';
import {OrderQuery} from '../../+state/order.query';
import {CommodityUniq} from '../../../commodity/entities/commodity-uniq.entity';
import {getFirstDayInMonth} from "@minhdu-fontend/utils";
import {DatePipe} from "@angular/common";
import {MatSort, Sort} from "@angular/material/sort";
import {RouteAction} from "../../../route/+state/route.action";

@Component({
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort

  orders$ = this.orderQuery.selectAll();
  loading$ = this.orderQuery.selectLoading();
  CommodityUniq$ = this.orderQuery.select(state => state.commodityUniq);
  commodities$ = this.orderQuery.selectAll().pipe(
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
  sortOrderEnum = SortOrderEnum

  formGroup = new FormGroup({
    paidType: new FormControl(''),
    customer: new FormControl(''),
    status: new FormControl(-1),
    explain: new FormControl(''),
    startedAt: new FormControl(),
    endedAt: new FormControl(),
    createStartedAt: new FormControl(),
    createEndedAt: new FormControl(),
    deliveryStartedAt: new FormControl(),
    deliveryEndedAt: new FormControl(),
    deliveredAt: new FormControl(),
    commodityTotal: new FormControl(''),
    ward: new FormControl(''),
    bsx: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly exportService: ExportService,
  ) {
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.actions$.dispatch(
      OrderActions.loadAll({param: {take: this.pageSize, skip: this.pageIndexInit, status: params.status || -1}})
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val: any) => {
          this.actions$.dispatch(
            OrderActions.loadAll({param:this.mapOrder(val)})
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
    this.actions$.dispatch(
      OrderActions.loadAll(this.mapOrder(val))
    );
  }

  mapOrder(val: any) {
    const value = Object.assign(JSON.parse(JSON.stringify(val)), {
      skip: this.pageIndexInit,
      take: this.pageSize,
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
      this.formGroup.get('endedAt')?.patchValue(value.endedAt);
    }
    if (this.sort.active) {
      Object.assign(value, {
        orderBy: this.sort.active ? this.sort.active : '',
        orderType: this.sort ? this.sort.direction : ''
      });
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
          this.actions$.dispatch(
            OrderActions.update({
              id: $event.id,
              updates: {
                deliveredAt: val.day
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
    return getTotalCommodity(CommodityUniq);
  }

  cancelOrder($event: any) {
    this.actions$.dispatch(OrderActions.cancelOrder({orderId: $event.id}));
  }

  deleteOrder($event: any) {
    const ref = this.dialog.open(DialogSharedComponent, {
      width: 'fit-content',
      data: {
        title: 'Xoá đơn hàng',
        description: 'Bạn có chắc chắn muốn xoá đơn hàng này vĩnh viễn'
      }
    });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(OrderActions.remove({id: $event.id}));
      }
    });
  }

  sortOrder() {
    this.actions$.dispatch(RouteAction.loadAll({
      params: this.mapOrder(this.formGroup.value)
    }));
  }
}
