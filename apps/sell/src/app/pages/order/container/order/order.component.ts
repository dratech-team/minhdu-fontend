import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api, PaginationDto } from '@minhdu-fontend/constants';
import { ConvertBoolean, ItemContextMenu, OrderEnum, PaidType, PaymentType } from '@minhdu-fontend/enums';
import { DialogDatePickerComponent } from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { debounceTime, map, tap } from 'rxjs/operators';
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

@Component({
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {
  ui$ = this.orderQuery.select((state) => state.ui);
  orders$ = this.orderQuery
    .selectAll()
    .pipe(map((value) => JSON.parse(JSON.stringify(value))));
  loading$ = this.orderQuery.selectLoading();
  totalOrder$ = this.orderQuery.select((state) => state.total);
  commodityUniq$ = this.orderQuery.select((state) => state.commodityUniq);
  totalCommodity$ = this.orderQuery.select((state) => state.totalCommodity);
  commodities$ = this.orderQuery.selectAll().pipe(
    map((orders) => {
      return _.uniqBy(
        _.flattenDeep(orders.map((order) => order.commodities)),
        'code'
      );
    })
  );

  radios = radiosStatusOrderConstant;
  ItemContextMenu = ItemContextMenu;
  paidType = PaidType;
  convertBoolean = ConvertBoolean;
  payType = PaymentType;
  pageSize = 25;
  pageIndexInit = 0;
  sortOrderEnum = OrderEnum;
  visible = false;
  pageSizeTable = 10;
  expandedAll$ = this.orderQuery.select((state) => state.expandedAll);
  search = this.orderQuery.getValue().search;
  valueSort?: Sort;
  widthConstant = WidthConstant;
  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: any) => this.onDetail(data.id, true)
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

  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.search.search),
    status: new UntypedFormControl(this.search.status),
    endedAt_start: new UntypedFormControl(this.search.endedAt_start),
    endedAt_end: new UntypedFormControl(this.search.endedAt_end),
    startedAt_end: new UntypedFormControl(this.search.startedAt_start),
    startedAt_start: new UntypedFormControl(this.search.startedAt_end),
    deliveredAt_start: new UntypedFormControl(
      this.search.deliveredAt_start
    ),
    deliveredAt_end: new UntypedFormControl(this.search.deliveredAt_end),
    commodity: new UntypedFormControl(this.search.commodity)
  });

  constructor(
    private readonly datePipe: DatePipe,
    private readonly actions$: Actions,
    private readonly orderQuery: OrderQuery,
    private readonly orderStore: OrderStore,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit() {
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
  }

  public onAdd() {
    this.modal.create({
      nzTitle: 'Thêm đơn hàng',
      nzContent: OrderDialogComponent,
      nzWidth: '80vw',
      nzFooter: []
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

  public onDelivery($event: any) {
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

  public onCancel($event: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Huỷ đơn hàng',
      nzContent: 'Bạn có chắc chắn muốn huỷ đơn hàng này không',
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(
          OrderActions.cancelOrder({ orderId: $event.id })
        );
      }
    });
  }

  public onRemove($event: any) {
    this.modal.warning({
      nzTitle: 'Xoá đơn hàng',
      nzContent: `Bạn có chắc chắn muốn xoá đơn hàng này vĩnh viễn`,
      nzOnOk: () =>
        this.actions$.dispatch(OrderActions.remove({ id: $event.id }))
    });
  }

   public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onPagination(pageIndex: number) {
    const value = this.formGroup.value;
    const count = this.orderQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(
        OrderActions.loadAll({
          param: this.mapOrder(value, true),
          isPagination: true
        })
      );
    }
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
    this.formGroup.get('endedAt_start')?.setValue($event.start),
      { emitEvent: false };
    this.formGroup.get('endedAt_end')?.setValue($event.end);
  }

  public onExpandAll() {
    const expanedAll = this.orderQuery.getValue().expandedAll;
    this.orderQuery.getAll().forEach((order: OrderEntity) => {
      this.orderStore.update(order.id, { expand: !expanedAll });
    });
    this.orderStore.update((state) => ({ ...state, expandedAll: !expanedAll }));
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
