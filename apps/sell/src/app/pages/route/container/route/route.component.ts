import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '@minhdu-fontend/constants';
import { ModeEnum, SortRouteEnum } from '@minhdu-fontend/enums';
import { DialogDatePickerComponent } from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { DialogExportComponent } from 'libs/components/src/lib/dialog-export/dialog-export.component';
import { ItemContextMenu } from 'libs/enums/sell/page-type.enum';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { RouteActions, RouteQuery, RouteStore } from '../../+state';
import { RouteEntity } from '../../entities';
import { Actions } from '@datorama/akita-ng-effects';
import { DatePipe } from '@angular/common';
import { OrderActions } from '../../../order/+state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContextMenuEntity, Sort } from '@minhdu-fontend/data-models';
import * as moment from 'moment';
import * as _ from 'lodash';
import { RadiosStatusRouteConstant } from '../../constants';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { UpdaterRouteTypeEnum } from '../../enums';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { RouteComponentService } from '../../shared';

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  valueSort?: Sort;

  account$ = this.accountQuery.selectCurrentUser();
  loading$ = this.routeQuery.selectLoading();
  total$ = this.routeQuery.select((state) => state.total);
  count$ = this.routeQuery.selectCount();
  remain$ = this.routeQuery.select((state) => state.remain);
  ui$ = this.routeQuery.select((state) => state.ui);
  expandAll$ = this.routeQuery.select((state) => state.expandedAll);
  routes$ = this.routeQuery
    .selectAll()
    .pipe(map((routes) => JSON.parse(JSON.stringify(routes))));

  visible = false;
  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.routeComponentService.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: RouteEntity) => this.routeComponentService.onUpdate(data, UpdaterRouteTypeEnum.GENERAL)
    },
    {
      title: 'Xoá',
      click: (data: RouteEntity) => this.routeComponentService.onRemove(data)
    }
  ];

  radios = RadiosStatusRouteConstant;
  ItemContextMenu = ItemContextMenu;
  SortRouteEnum = SortRouteEnum;
  ModeEnum = ModeEnum;

  search = this.routeQuery.getValue().search;
  formGroup = new FormGroup({
    search: new FormControl(this.search.search),
    startedAt_start: new FormControl(this.search.startedAt_start),
    startedAt_end: new FormControl(this.search.startedAt_end),
    endedAt_start: new FormControl(this.search.endedAt_start),
    endedAt_end: new FormControl(this.search.endedAt_end),
    status: new FormControl(this.search.status)
  });

  constructor(
    public readonly routeComponentService: RouteComponentService,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService,
    private readonly routeStore: RouteStore,
    private readonly routeQuery: RouteQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(debounceTime(1500), startWith(this.formGroup.value))
      .subscribe((route) => {
        this.actions$.dispatch(
          RouteActions.loadAll({ search: this.mapRoute(route), isPaginate: false })
        );
      });
  }

  onExport() {
    const value = this.formGroup.value;
    this.modal.create({
      nzContent: DialogExportComponent,
      nzComponentParams: {
        data: {
          filename:
            'Danh sách tuyến đường từ ngày ' +
            this.datePipe.transform(value.startedAt_start, 'dd-MM-yyyy') +
            ' đến ngày ' +
            this.datePipe.transform(value.endedAt_end, 'dd-MM-yyyy'),
          title: 'Xuât bảng Tuyến đường',
          params: Object.assign(_.omit(value, ['take', 'skip']), {
            exportType: 'ROUTE'
          }),
          api: Api.SELL.ROUTE.ROUTE_EXPORT,
          selectDatetime: true,
          typeDate: 'RANGE_DATETIME'
        }
      }
    });
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onEnd(route: RouteEntity) {
    this.modal.create({
      nzTitle: 'Xác nhận giao hàng',
      nzContent: DialogDatePickerComponent,
      nzMaskClosable: false,
      nzFooter: []
    }).afterClose.subscribe((res: { date: Date }) => {
      if (res) {
        this.actions$.dispatch(
          RouteActions.update({ id: route.id, updates: { endedAt: res.date } })
        );
      }
    });
  }

  public onPickStartedDay($event: any) {
    this.formGroup
      .get('startedAt_start')
      ?.setValue($event.start, { emitEvent: false });
    this.formGroup.get('startedAt_end')?.setValue($event.end);
  }

  public onPickEndedAtDay($event: any) {
    this.formGroup
      .get('endedAt_start')
      ?.setValue($event.start, { emitEvent: false });
    this.formGroup.get('endedAt_end')?.setValue($event.end);
  }

  public onLoadMore() {
    this.actions$.dispatch(
      RouteActions.loadAll({ search: this.mapRoute(this.formGroup.value), isPaginate: true })
    );
  }

  public onExpandAll() {
    const expandedAll = this.routeQuery.getValue().expandedAll;
    this.routeQuery.getAll().forEach((route: RouteEntity) => {
      this.routeStore.update(route.id, { expand: !expandedAll });
    });
    this.routeStore.update((state) => ({ ...state, expandedAll: !expandedAll }));
  }

  public onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      OrderActions.loadAll({
        search: this.mapRoute(this.formGroup.value),
        isPaginate: false
      })
    );
  }

  public compareDay(date: Date): boolean {
    return moment(date).isAfter(new Date(), 'day');
  }

  private mapRoute(val: any) {
    this.routeStore.update((state) => ({
      ...state,
      search: val
    }));
    if (!val.endedAt_start || !val.endedAt_end) {
      delete val.endedAt_end;
      delete val.endedAt_start;
    }
    if (this.valueSort?.orderType) {
      Object.assign(val, this.valueSort);
    } else {
      delete val.orderType;
      delete val.orderBy;
    }
    return val;
  }
}
