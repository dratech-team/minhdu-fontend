import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, PaginationDto } from '@minhdu-fontend/constants';
import {
  ConvertBoolean,
  ItemContextMenu,
  ModeEnum,
  PaidType,
  PaymentType,
  SortTypeOrderEnum
} from '@minhdu-fontend/enums';
import { DialogDatePickerComponent } from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { map, tap } from 'rxjs/operators';
import { OrderActions, OrderQuery, OrderStore } from '../../+state';
import { Actions } from '@datorama/akita-ng-effects';
import { ContextMenuEntity, Sort } from '@minhdu-fontend/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../../component';
import * as _ from 'lodash';
import { OrderEntity } from '../../enitities/order.entity';
import { radiosStatusOrderConstant } from '../../constants';
import { WidthConstant } from '../../../../shared/constants';
import { ModalExportExcelComponent, ModalExportExcelData } from '@minhdu-fontend/components';
import { DatePipe } from '@angular/common';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { OrderStatusEnum } from '../../enums';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';

@Component({
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {
  valueSort?: Sort;

  account$ = this.accountQuery.selectCurrentUser();
  ui$ = this.orderQuery.select((state) => state.ui);
  expandedAll$ = this.orderQuery.select((state) => state.expandedAll);
  loading$ = this.orderQuery.selectLoading();
  total$ = this.orderQuery.select((state) => state.total);
  count$ = this.orderQuery.selectCount();
  remain$ = this.orderQuery.select((state) => state.remain);
  commodityUniq$ = this.orderQuery.select((state) => state.commodityUniq);
  totalCommodity$ = this.orderQuery.select((state) => state.totalCommodity);
  orders$ = this.orderQuery
    .selectAll()
    .pipe(map((value) => JSON.parse(JSON.stringify(value))));
  commodities$ = this.orderQuery.selectAll().pipe(
    map((orders) => {
      return _.uniqBy(
        _.flattenDeep(orders.map((order) => order.commodities)),
        'code'
      );
    })
  );

  radios = radiosStatusOrderConstant;

  ModeEnum = ModeEnum;
  ItemContextMenu = ItemContextMenu;
  PaidType = PaidType;
  ConvertBoolean = ConvertBoolean;
  PaymentType = PaymentType;
  SortTypeOrderEnum = SortTypeOrderEnum;
  widthConstant = WidthConstant;

  pageSize = 25;
  pageIndexInit = 0;
  visible = false;
  pageSizeTable = 10;
  search = this.orderQuery.getValue().search;


  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: OrderEntity) => this.onUpdate(data)
    },
    {
      title: 'Xoá',
      click: (data: any) => this.onRemove(data)
    },
    {
      title: 'Huỷ',
      click: (data: OrderEntity) => this.onCancel(data)
    },
    {
      title: 'Đã giao',
      click: (data: any) => this.onDelivery(data)
    }
  ];

  formGroup = new FormGroup({
    search: new FormControl<string>(''),
    status: new FormControl<OrderStatusEnum>(OrderStatusEnum.ALL),
    endedAt_start: new FormControl<Date | null>(null),
    endedAt_end: new FormControl<Date | null>(null),
    startedAt_end: new FormControl<Date>(getFirstDayInMonth(new Date())),
    startedAt_start: new FormControl<Date>(getLastDayInMonth(new Date())),
    deliveredAt_start: new FormControl<Date | null>(null),
    deliveredAt_end: new FormControl<Date | null>(null),
    commodity: new FormControl('')
  });

  constructor(
    private readonly datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService,
    private readonly orderStore: OrderStore,
    private readonly orderQuery: OrderQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(
        tap((val: any) => {
          this.actions$.dispatch(
            OrderActions.loadAll({ param: this.mapOrder(val) })
          );
        })
      )
      .subscribe();
  }

  public onAdd() {
    this.modal.create({
      nzTitle: 'Thêm đơn hàng',
      nzContent: OrderDialogComponent,
      nzWidth: '80vw',
      nzFooter: null
    });
  }

  public onDetail(id: number, isUpdate: boolean) {
    this.router
      .navigate(['don-hang/chi-tiet-don-hang', id], {
        queryParams: {
          isUpdate: isUpdate
        }
      })
      .then();
  }

  public onUpdate(order: OrderEntity) {
    this.modal.create({
      nzTitle: 'Sửa đơn hàng',
      nzContent: OrderDialogComponent,
      nzComponentParams: {
        data: { order: order, tab: 0, isUpdate: true }
      },
      nzFooter: [],
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  public onDelivery(order: OrderEntity) {
    this.modal.create({
      nzTitle: 'Xác nhận ngày giao hàng',
      nzContent: DialogDatePickerComponent,
      nzMaskClosable: false,
      nzFooter: []
    }).afterClose.subscribe((res: { date: Date }) => {
      if (res) {
        this.actions$.dispatch(
          OrderActions.update({
            id: order.id,
            updates: {
              deliveredAt: res.date
            }
          })
        );
      }
    });
  }

  public onCancel(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Huỷ đơn hàng',
      nzContent: `Bạn có chắc chắn muốn huỷ đơn hàng đến ${order.province.name} của khách hàng ${order.customer.lastName} không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(
          OrderActions.cancelOrder({ orderId: order.id })
        );
      }
    });
  }

  public onRemove(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Xoá đơn hàng',
      nzContent: `Bạn có chắc chắn muốn xoá đơn hàng đến ${order.province.name} của khách hàng ${order.customer.lastName} vĩnh viễn không?`,
      nzOnOk: () =>
        this.actions$.dispatch(OrderActions.remove({ id: order.id }))
    });
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll(this.mapOrder(this.formGroup.value, true))
    );
  }

  public onPickDeliveryDay($event: any) {
    this.formGroup
      .get('deliveredAt_start')
      ?.setValue($event.start, { emitEvent: false });
    this.formGroup.get('deliveredAt_end')?.setValue($event.end);
  }

  public onPickCreatedAt($event: any) {
    this.formGroup
      .get('startedAt_start')
      ?.setValue($event.start, { emitEvent: false });
    this.formGroup.get('startedAt_end')?.setValue($event.end);
  }

  public onPickEndedAt($event: any) {
    this.formGroup.get('endedAt_start')?.setValue($event.start, { emitEvent: false });
    this.formGroup.get('endedAt_end')?.setValue($event.end);
  }

  public onExpandAll() {
    const expandedAll = this.orderQuery.getValue().expandedAll;
    this.orderQuery.getAll().forEach((order: OrderEntity) => {
      this.orderStore.update(order.id, { expand: !expandedAll });
    });
    this.orderStore.update((state) => ({ ...state, expandedAll: !expandedAll }));
  }

  public onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      OrderActions.loadAll({
        param: this.mapOrder(this.formGroup.value)
      })
    );
  }

  public onPrint() {
    this.modal.create({
      nzTitle: 'Xuất danh sách đơn hàng',
      nzWidth: 'fit-content',
      nzContent: ModalExportExcelComponent,
      nzComponentParams: <{ data: ModalExportExcelData }>{
        data: {
          filename:
            `Đơn hàng` +
            ` từ ngày ${this.datePipe.transform(
              this.formGroup.value.startedAt_start,
              'dd-MM-yyy'
            )}` +
            ` đến ngày ${this.datePipe.transform(
              this.formGroup.value.startedAt_start,
              'dd-MM-yyy'
            )}`,
          params: Object.assign(
            {},
            _.omit(this.mapOrder(this.formGroup.value, false), [
              'take',
              'skip'
            ]),
            { exportType: 'ORDER' }
          ),
          api: Api.SELL.ORDER.ORDER_EXPORT,
          selectDatetime: true,
          typeDate: 'RANGE_DATETIME'
        }
      },
      nzFooter: []
    });
  }

  private mapOrder(dataFG: any, isPagination?: boolean) {
    this.orderStore.update((state) => ({
      ...state,
      search: dataFG
    }));
    const value = Object.assign(JSON.parse(JSON.stringify(dataFG)), {
      skip: isPagination ? this.orderQuery.getCount() : PaginationDto.skip,
      take: this.pageSize
    });
    return Object.assign(
      {},
      value?.status !== 1
        ? _.omit(value, ['deliveredAt_end', 'deliveredAt_start'])
        : value,
      this.valueSort?.orderType ? this.valueSort : {}
    );
  }
}
