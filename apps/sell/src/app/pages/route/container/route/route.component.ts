import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '@minhdu-fontend/constants';
import { SortRouteEnum } from '@minhdu-fontend/enums';
import { DialogDatePickerComponent } from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { DialogExportComponent } from 'libs/components/src/lib/dialog-export/dialog-export.component';
import { ItemContextMenu } from 'libs/enums/sell/page-type.enum';
import { debounceTime, map, tap } from 'rxjs/operators';
import { RouteActions, RouteQuery, RouteStore } from '../../+state';
import { RouteEntity } from '../../entities';
import { RouteDialogComponent } from '../../component';
import { Actions } from '@datorama/akita-ng-effects';
import { DatePipe } from '@angular/common';
import { OrderActions } from '../../../order/+state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContextMenuEntity, Sort } from '@minhdu-fontend/data-models';
import * as moment from 'moment';
import * as _ from 'lodash';
import { RadiosStatusRouteConstant } from '../../constants';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { UpdaterRouteTypeEnum } from '../../enums/updater-route-type.enum';

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  expandAll$ = this.routeQuery.select((state) => state.expandedAll);
  routes$ = this.routeQuery
    .selectAll()
    .pipe(map((routes) => JSON.parse(JSON.stringify(routes))));
  loading$ = this.routeQuery.selectLoading();
  total$ = this.routeQuery.select((state) => state.total);
  deleted$ = this.routeQuery.select((state) => state.deleted);
  ui$ = this.routeQuery.select((state) => state.ui);

  pageSize = 30;
  pageIndexInit = 0;
  pageSizeTable = 10;
  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: any) => this.onUpdate(data.id, data)
    },
    {
      title: 'Xoá',
      click: (data: any) => this.onRemove(data)
    }
  ];

  ItemContextMenu = ItemContextMenu;
  radios = RadiosStatusRouteConstant;
  SortRouteEnum = SortRouteEnum;

  search = this.routeQuery.getValue().search;
  formGroup = new UntypedFormGroup({
    search: new UntypedFormControl(this.search.search),
    startedAt_start: new UntypedFormControl(this.search.startedAt_start),
    startedAt_end: new UntypedFormControl(this.search.startedAt_end),
    endedAt_start: new UntypedFormControl(this.search.endedAt_start),
    endedAt_end: new UntypedFormControl(this.search.endedAt_end),
    status: new UntypedFormControl(this.search.status)
  });

  valueSort?: Sort;
  visible = false;

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(
            RouteActions.loadAll({ params: this.mapRoute(val) })
          );
        })
      )
      .subscribe();
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzFooter: []
    });
  }

  onDetail(id: number) {
    this.router
      .navigate(['tuyen-duong/chi-tiet-tuyen-duong', id])
      .then();
  }

  onUpdate(id: number, route: RouteEntity) {
    return this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzComponentParams: <{ data?: any }>{
        data: { route: route, updateType: UpdaterRouteTypeEnum.GENERAL }
      },
      nzFooter: []
    });
  }

  onRemove(route: RouteEntity) {
    this.modal.warning({
      nzTitle: 'Xoá tuyến đương',
      nzContent: `Bạn có chắc chắn muốn xoá tuyến đường ${route.name} này không`,
      nzOkDanger: true,
      nzOnOk: () =>
        this.actions$.dispatch(RouteActions.remove({ idRoute: route.id }))
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

  public onPagination(pageIndex: number) {
    const value = this.formGroup.value;
    const count = this.routeQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(
        RouteActions.loadAll({
          params: this.mapRoute(value, true),
          isPagination: true
        })
      );
    }
  }

  public onExpandAll() {
    const expanedAll = this.routeQuery.getValue().expandedAll;
    this.routeQuery.getAll().forEach((route: RouteEntity) => {
      this.routeStore.update(route.id, { expand: !expanedAll });
    });
    this.routeStore.update((state) => ({ ...state, expandedAll: !expanedAll }));
  }

  public onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      OrderActions.loadAll({
        param: this.mapRoute(this.formGroup.value)
      })
    );
  }

  public compareDay(date: Date): boolean {
    return moment(date).isAfter(new Date(), 'day');
  }

  private mapRoute(val: any, isPagination?: boolean) {
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
    return Object.assign(val, {
      skip: isPagination ? this.routeQuery.getCount() : 0,
      take: this.pageSize
    });
  }
}
