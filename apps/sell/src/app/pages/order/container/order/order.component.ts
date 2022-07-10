import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '@minhdu-fontend/constants';
import {
  ConvertBoolean,
  ItemContextMenu,
  ModeEnum,
  PaidType,
  PaymentType,
  SortTypeOrderEnum
} from '@minhdu-fontend/enums';
import { debounceTime, map } from 'rxjs/operators';
import { OrderActions, OrderQuery, OrderStore } from '../../+state';
import { Actions } from '@datorama/akita-ng-effects';
import { ContextMenuEntity, Sort } from '@minhdu-fontend/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
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
import { OrderComponentService } from '../shared/order.component.service';

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
      click: () => this.orderComponentService.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: OrderEntity) => this.orderComponentService.onUpdate(data)
    },
    {
      title: 'Xoá',
      click: (data: any) => this.orderComponentService.onRemove(data)
    },
    {
      title: 'Huỷ',
      click: (data: OrderEntity) => this.orderComponentService.onCancel(data)
    },
    {
      title: 'Giao hàng',
      click: (data: any) => this.orderComponentService.onDelivery(data)
    },
    {
      title: 'Khôi phục',
      click: (data: OrderEntity) => this.orderComponentService.onRestore(data)
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
    public readonly orderComponentService: OrderComponentService,
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
    this.formGroup.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((order) => {
      this.actions$.dispatch(
        OrderActions.loadAll({ search: this.mapOrder(order), isPaginate: false })
      );
    });
  }

  public onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll({ search: this.mapOrder(this.formGroup.value), isPaginate: true })
    );
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
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
        search: this.mapOrder(this.formGroup.value),
        isPaginate: true
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
            _.omit(this.mapOrder(this.formGroup.value), [
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

  private mapOrder(dataFG: any) {
    return Object.assign(
      {},
      dataFG?.status !== 1
        ? _.omit(dataFG, ['deliveredAt_end', 'deliveredAt_start'])
        : dataFG,
      this.valueSort?.orderType ? this.valueSort : {}
    );
  }
}
