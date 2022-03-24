import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, CurrenciesConstant, radiosStatusOrderConstant} from '@minhdu-fontend/constants';
import {
  ConvertBoolean,
  ItemContextMenu,
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
import {
  DialogSharedComponent
} from '../../../../../../../../libs/components/src/lib/dialog-shared/dialog-shared.component';
import {Actions} from '@datorama/akita-ng-effects';
import {OrderQuery} from '../../+state/order.query';
import {OrderEntity} from '../../enitities/order.interface';
import {OrderStore} from '../../+state/order.store';
import {Sort} from '@minhdu-fontend/data-models';
import {NzModalService} from "ng-zorro-antd/modal";
import {OrderDialogComponent} from "../../component/order-dialog/order-dialog.component";

@Component({
  templateUrl: 'order.component.html'
})


export class OrderComponent implements OnInit {
  ui$ = this.orderQuery.select(state => state.ui);
  orders$ = this.orderQuery.selectAll().pipe(map(value => JSON.parse(JSON.stringify(value))));
  loading$ = this.orderQuery.selectLoading();
  totalOrder$ = this.orderQuery.select(state => state.total);
  commodityUniq$ = this.orderQuery.select(state => state.commodityUniq);
  totalCommodity$ = this.orderQuery.select(state => state.totalCommodity);
  commodities$ = this.orderQuery.selectAll().pipe(
    map(orders => {
      return _.uniqBy(_.flattenDeep(orders.map(order => order.commodities)), 'code');
    })
  );

  radios = radiosStatusOrderConstant;
  ItemContextMenu = ItemContextMenu;
  paidType = PaidType;
  statusOrder = StatusOrder;
  currenciesConstant = CurrenciesConstant;
  convertBoolean = ConvertBoolean;
  payType = PaymentType;
  pageSize = 25;
  pageIndexInit = 0;
  sortOrderEnum = SortOrderEnum;
  visible = false;
  pageSizeTable = 10;
  expanedAll$ = this.orderQuery.select(state => state.expandedAll);
  stateSearch = this.orderQuery.getValue().search
  valueSort?: Sort;
  formGroup = new FormGroup({
    search: new FormControl(this.stateSearch.search),
    paidType: new FormControl(this.stateSearch.paidType),
    customer: new FormControl(this.stateSearch.customer),
    status: new FormControl(this.stateSearch.status),
    explain: new FormControl(this.stateSearch.explain),
    endedAt: new FormControl(this.stateSearch.endedAt),
    createdAt: new FormControl(this.stateSearch.createdAt),
    deliveredAt: new FormControl(this.stateSearch.deliveredAt),
    commodityTotal: new FormControl(this.stateSearch.commodityTotal),
    province: new FormControl(this.stateSearch.province),
    bsx: new FormControl(this.stateSearch.bsx),
    commodity: new FormControl(this.stateSearch.commodity)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(OrderActions.loadAll({
      param: this.mapOrder(this.formGroup.value)
    }));

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val: any) => {
          this.actions$.dispatch(
            OrderActions.loadAll({param: this.mapOrder(val)})
          );
        })
      )
      .subscribe();
  }


  add() {
    this.modal.create({
      nzTitle: 'Thêm đơn hàng',
      nzContent: OrderDialogComponent,
      nzWidth: '80vw',
      nzFooter: null
    })
    // this.router.navigate(['don-hang/them-don-hang']).then();
  }

  readOrUpdate(id: number, isUpdate: boolean) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id], {
      queryParams: {
        isUpdate: isUpdate
      }
    }).then();
  }

  update($event: any) {
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

  cancel($event: any) {
    this.actions$.dispatch(OrderActions.cancelOrder({orderId: $event.id}));
  }

  delete($event: any) {
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

  onPagination(pageIndex: number) {
    const value = this.formGroup.value;
    const count = this.orderQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(OrderActions.loadAll({
        param: this.mapOrder(value, true),
        isPagination: true
      }));
    }

  }

  onPickDeliveryDay($event: any) {
    this.formGroup.get('deliveredAt')?.setValue($event);
  }

  onPickCreatedAt($event: any) {
    this.formGroup.get('createdAt')?.setValue($event);

  }

  onPickEndedAt($event: any) {
    this.formGroup.get('endedAt')?.setValue($event);
  }

  onExpandAll() {
    const expanedAll = this.orderQuery.getValue().expandedAll;
    this.orderQuery.getAll().forEach((order: OrderEntity) => {
      this.orderStore.update(order.id, {expand: !expanedAll});
    });
    this.orderStore.update(state => ({...state, expandedAll: !expanedAll}));
  }

  onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(OrderActions.loadAll({
      param: this.mapOrder(this.formGroup.value)
    }));
  }

  mapOrder(dataFG: any, isPagination?: boolean) {
    this.orderStore.update(state => ({
      ...state, search: dataFG
    }))
    const value = Object.assign(JSON.parse(JSON.stringify(dataFG)), {
      skip: isPagination ? this.orderQuery.getCount() : 0,
      take: this.pageSize
    });
    if (value?.status !== 1) {
      delete value.deliveredAt;
    }

    if (this.valueSort?.orderType) {
      Object.assign(value, this.valueSort);
    }
    return value;
  }

  onPrint() {
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
}
