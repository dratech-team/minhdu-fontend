import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, TitleDatetime } from '@minhdu-fontend/constants';
import { ModeEnum } from '@minhdu-fontend/enums';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { OrderActions, OrderQuery, OrderStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { ContextMenuEntity, SortEntity } from '@minhdu-fontend/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';
import { OrderEntity } from '../../enitities';
import { radiosStatusOrderConstant } from '../../constants';
import { ModalExportExcelComponent, ModalExportExcelData } from '@minhdu-fontend/components';
import { DatePipe } from '@angular/common';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { OrderComponentService } from '../../shared';
import { OrderStatusEnum } from '../../enums';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommodityTemplateActions } from '../../../commodity-template/state/commodity-template.action';
import { CommodityTemplateQuery } from '../../../commodity-template/state/commodity-template.query';
import { CustomNgSortPipe } from '../../../../shared/pipe/sort.pipe';

@Component({
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  account$ = this.accountQuery.selectCurrentUser();
  ui$ = this.orderQuery.select((state) => state.ui);
  expandedAll$ = this.orderQuery.select((state) => state.expandedAll);
  loading$ = this.orderQuery.selectLoading();
  total$ = this.orderQuery.select((state) => state.total);
  count$ = this.orderQuery.selectCount();
  remain$ = this.orderQuery.select((state) => state.remain);
  commodityUniq$ = this.orderQuery.select((state) => state.commodityUniq);
  totalCommodity$ = this.orderQuery.select((state) => state.commodityTotal);
  orders$ = this.orderQuery
    .selectAll()
    .pipe(map((value) => JSON.parse(JSON.stringify(value))));
  commodities$ = this.commodityTemplateQuery.selectAll();

  radios = radiosStatusOrderConstant;

  ModeEnum = ModeEnum;

  visible = false;
  search = this.orderQuery.getValue().search;

  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.orderComponentService.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: OrderEntity) => this.orderComponentService.onUpdate(data, 'GENERAL')
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
      click: (data: OrderEntity) => {
        if (data.deliveredAt) {
          return this.orderComponentService.onRestore(data);
        }
        return this.message.error('Đơn hàng chưa giao không thể khôi phục');
      }
    }
  ];

  formGroup = new FormGroup({
    search: new FormControl<string>(''),
    status: new FormControl<OrderStatusEnum>(OrderStatusEnum.ALL),
    startedAt_start: new FormControl<Date>(getFirstDayInMonth(new Date())),
    startedAt_end: new FormControl<Date>(getLastDayInMonth(new Date())),
    deliveredAt_start: new FormControl<Date | null>(null),
    deliveredAt_end: new FormControl<Date | null>(null),
    endedAt_start: new FormControl<Date | null>(null),
    endedAt_end: new FormControl<Date | null>(null),
    commodity: new FormControl('')
  });

  constructor(
    public readonly message: NzMessageService,
    public readonly orderComponentService: OrderComponentService,
    private readonly datePipe: DatePipe,
    private readonly nzSortPipe: CustomNgSortPipe,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService,
    private readonly orderStore: OrderStore,
    private readonly orderQuery: OrderQuery,
    private readonly commodityTemplateQuery: CommodityTemplateQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CommodityTemplateActions.loadAll({ isSet: false }));
    this.formGroup.valueChanges
      .pipe(debounceTime(500), startWith(this.formGroup.value))
      .subscribe((order) => {
        this.actions$.dispatch(
          OrderActions.loadAll({ search: this.mapOrder(order), isSet: false })
        );
      });
  }

  public onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll({ search: this.mapOrder(this.formGroup.value), isSet: true })
    );
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onPickDeliveryDay($event: Pick<TitleDatetime, 'start' | 'end'>) {
    this.formGroup.get('deliveredAt_start')?.setValue($event.start);
    this.formGroup.get('deliveredAt_end')?.setValue($event.end);
  }

  public onPickCreatedAt($event: Pick<TitleDatetime, 'start' | 'end'>) {
    this.formGroup.get('startedAt_start')?.setValue($event.start);
    this.formGroup.get('startedAt_end')?.setValue($event.end);
  }

  public onPickEndedAt(datetime: Pick<TitleDatetime, 'start' | 'end'>) {
    this.formGroup.get('endedAt_start')?.setValue(datetime.start);
    this.formGroup.get('endedAt_end')?.setValue(datetime.end);
  }

  public onExpandAll() {
    const expandedAll = this.orderQuery.getValue().expandedAll;
    this.orderQuery.getAll().forEach((order: OrderEntity) => {
      this.orderStore.update(order.id, { expand: !expandedAll });
    });
    this.orderStore.update((state) => ({ ...state, expandedAll: !expandedAll }));
  }

  public onSort(sort: SortEntity) {
    this.actions$.dispatch(
      OrderActions.loadAll({
        search: this.mapOrder(this.formGroup.value, sort),
        isSet: false
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

  private mapOrder(dataFG: any, sort?: SortEntity) {
    if (!dataFG.startedAt_start || !dataFG.startedAt_end) {
      dataFG = _.omit(dataFG, ['startedAt_start', 'startedAt_end']);
    }
    if (!dataFG.endedAt_start || !dataFG.endedAt_end) {
      dataFG = _.omit(dataFG, ['endedAt_start', 'endedAt_end']);
    }
    if (!dataFG.deliveredAt_start || !dataFG.deliveredAt_start || dataFG?.status !== 1) {
      dataFG = _.omit(dataFG, ['deliveredAt_end', 'deliveredAt_start']);
    }
    return Object.assign({}, dataFG, this.nzSortPipe.transform(sort));
  }
}
