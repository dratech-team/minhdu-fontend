import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, CurrenciesConstant } from '@minhdu-fontend/constants';
import {
  ConvertBoolean,
  ItemContextMenu,
  PaidType,
  PaymentType,
  SortOrderEnum,
  StatusOrder
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { DialogDatePickerComponent } from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { DialogExportComponent } from 'libs/components/src/lib/dialog-export/dialog-export.component';
import { debounceTime, map, tap } from 'rxjs/operators';
import { OrderActions } from '../../+state/order.actions';
import * as _ from 'lodash';
import { getTotalCommodity } from '../../../../../../../../libs/utils/sell.ultil';
import { DialogSharedComponent } from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import { Actions } from '@datorama/akita-ng-effects';
import { OrderQuery } from '../../+state/order.query';
import { CommodityUniq } from '../../../commodity/entities/commodity-uniq.entity';
import { OrderEntity } from '../../enitities/order.interface';
import { CommodityEntity } from '../../../commodity/entities/commodity.entity';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {
  orders$ = this.orderQuery.selectAll();
  loading$ = this.orderQuery.selectLoading();
  CommodityUniq$ = this.orderQuery.select(state => state.commodityUniq);
  commodities$ = this.orderQuery.selectAll().pipe(
    map(orders => {
      return _.uniqBy(_.flattenDeep(orders.map(order => order.commodities)), 'code');
    })
  );
  orders: OrderEntity[] = [];
  commodities: CommodityEntity[] = [];
  ItemContextMenu = ItemContextMenu;
  paidType = PaidType;
  statusOrder = StatusOrder;
  currenciesConstant = CurrenciesConstant;
  convertBoolean = ConvertBoolean;
  payType = PaymentType;
  pageSize = 40;
  pageIndexInit = 0;
  sortOrderEnum = SortOrderEnum;
  totalCommodity!: number;

  formGroup = new FormGroup({
    search: new FormControl(''),
    paidType: new FormControl(''),
    customer: new FormControl(''),
    status: new FormControl(-1),
    explain: new FormControl(''),
    startedAt: new FormControl(''),
    endedAt: new FormControl(''),
    createStartedAt: new FormControl(),
    createEndedAt: new FormControl(),
    deliveryStartedAt: new FormControl(),
    deliveryEndedAt: new FormControl(),
    deliveredAt: new FormControl(),
    commodityTotal: new FormControl(''),
    province: new FormControl(''),
    bsx: new FormControl(''),
    commodity: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.CommodityUniq$.subscribe(val => {
      this.totalCommodity = val.reduce((x, y) => x + y.amount, 0);
    });
    const params = this.route.snapshot.queryParams;
    this.actions$.dispatch(
      OrderActions.loadAll({ param: { take: this.pageSize, skip: this.pageIndexInit, status: params.status } })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val: any) => {
          this.actions$.dispatch(
            OrderActions.loadAll({ param: this.mapOrder(val) })
          );
        })
      )
      .subscribe();

    this.orders$.subscribe(val => {
      this.orders = JSON.parse(JSON.stringify(val));
    });

    this.commodities$.subscribe(val => {
      this.commodities = val;
    });

  }


  add() {
    this.router.navigate(['don-hang/them-don-hang']).then();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(
      OrderActions.loadAll(this.mapOrder(val, true))
    );
  }

  mapOrder(val: any, isScroll?: boolean) {
    const value = Object.assign(JSON.parse(JSON.stringify(val)), {
      skip: isScroll ? this.orderQuery.getCount() : 0,
      take: this.pageSize
    });
    if (!value?.createStartedAt && !value?.createEndedAt) {
      delete value?.createStartedAt;
      delete value?.createEndedAt;
    }
    if (!value?.deliveryStartedAt && !value.deliveryEndedAt) {
      delete value?.deliveryStartedAt;
      delete value?.deliveryEndedAt;
    }

    if (!value?.startedAt && !value?.endedAt) {
      delete value?.startedAt;
      delete value?.endedAt;
    }

    if (!value?.deliveredAt) {
      delete value?.deliveredAt;
    }

    if (value?.startedAt && !value?.endedAt) {
      value.endedAt = value?.startedAt;
      this.formGroup.get('endedAt')?.patchValue(value.endedAt);
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
    this.actions$.dispatch(OrderActions.cancelOrder({ orderId: $event.id }));
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
        this.actions$.dispatch(OrderActions.remove({ id: $event.id }));
      }
    });
  }

  paramChange(params: NzTableQueryParams) {
    const value = this.formGroup.value;
    params.sort.map(val => {
      if (val.value) {
        Object.assign(value, {
          orderBy: val.key,
          orderType: val.value === 'ascend' ? 'asc' : 'des'
        });
        this.actions$.dispatch(OrderActions.loadAll({
          param: this.mapOrder(value)
        }));
      }
    });
  }

  pickDeliveryDay($event: any) {
    this.formGroup.get('deliveryStartedAt')?.setValue($event.startAt, { emitEvent: false });
    this.formGroup.get('deliveryEndedAt')?.setValue($event.endedAt);
  }

  pickCreatedAt($event: any) {
    console.log($event);
    this.formGroup.get('createStartedAt')?.setValue($event.startAt, { emitEvent: false });
    this.formGroup.get('createEndedAt')?.setValue($event.endedAt);
  }
}
