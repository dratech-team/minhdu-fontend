import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api} from '@minhdu-fontend/constants';
import {SortRouteEnum} from '@minhdu-fontend/enums';
import {DialogDatePickerComponent} from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {DialogExportComponent} from 'libs/components/src/lib/dialog-export/dialog-export.component';
import {ItemContextMenu} from 'libs/enums/sell/page-type.enum';
import {debounceTime, map, tap} from 'rxjs/operators';
import {RouteActions, RouteQuery, RouteStore} from '../../+state';
import {RouteEntity} from '../../entities';
import {RouteDialogComponent} from '../../component';
import {Actions} from '@datorama/akita-ng-effects';
import {DatePipe} from '@angular/common';
import {OrderActions} from '../../../order/+state';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Sort} from '@minhdu-fontend/data-models';
import * as moment from 'moment';
import * as _ from 'lodash';
import {RadiosStatusRouteConstant} from '../../constants';

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  expandAll$ = this.routeQuery.select(state => state.expandedAll);
  routes$ = this.routeQuery.selectAll().pipe(map(routes => JSON.parse(JSON.stringify(routes))));
  loading$ = this.routeQuery.selectLoading();
  total$ = this.routeQuery.select(state => state.total);
  deleted$ = this.routeQuery.select(state => state.deleted);
  ui$ = this.routeQuery.select(state => state.ui);

  pageSize = 30;
  pageIndexInit = 0;
  pageSizeTable = 10;
  ItemContextMenu = ItemContextMenu;
  radios = RadiosStatusRouteConstant;
  sortRouteEnum = SortRouteEnum;
  stateSearch = this.routeQuery.getValue().search;
  formGroup = new FormGroup({
    search: new FormControl(this.stateSearch.search),
    startedAt_start: new FormControl(this.stateSearch.startedAt_start),
    startedAt_end: new FormControl(this.stateSearch.startedAt_end),
    endedAt_start: new FormControl(this.stateSearch.endedAt_start),
    endedAt_end: new FormControl(this.stateSearch.endedAt_end),
    status: new FormControl(this.stateSearch.status)
  });

  valueSort?: Sort;
  visible = false;

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly routeStore: RouteStore,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly modal: NzModalService
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(RouteActions.loadAll({params: this.mapRoute(val)}));
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

  onRemove(route: RouteEntity) {
    this.modal.warning({
      nzTitle: 'Xoá tuyến đương',
      nzContent: `Bạn có chắc chắn muốn xoá tuyến đường ${route.name} này không`,
      nzOkDanger: true,
      nzOnOk: () => this.actions$.dispatch(RouteActions.remove({idRoute: route.id}))
    })
  }

  onEnd(event: RouteEntity) {
    this.dialog
      .open(DialogDatePickerComponent, {
        width: 'fit-content',
        data: {
          titlePopup: 'Xác nhận giao hàng',
          title: 'Ngày giao hàng'
        }
      })
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.actions$.dispatch(
            RouteActions.update({id: event.id, updates: {endedAt: val.day}})
          );
        }
      });
  }

  onDetail(id: number, isUpdate: boolean) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id], {queryParams: {isUpdate}}).then();
  }

  onPickStartedDay($event: any) {
    this.formGroup.get('startedAt_start')?.setValue($event.start, {emitEvent: false});
    this.formGroup.get('startedAt_end')?.setValue($event.end);
  }

  onPickEndedAtDay($event: any) {
    this.formGroup.get('endedAt_start')?.setValue($event.start, {emitEvent: false});
    this.formGroup.get('endedAt_end')?.setValue($event.end);
  }

  onPagination(pageIndex: number) {
    const value = this.formGroup.value;
    const count = this.routeQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(RouteActions.loadAll({
        params: this.mapRoute(value, true),
        isPagination: true
      }));
    }
  }

  onExpandAll() {
    const expanedAll = this.routeQuery.getValue().expandedAll;
    this.routeQuery.getAll().forEach((route: RouteEntity) => {
      this.routeStore.update(route.id, {expand: !expanedAll});
    });
    this.routeStore.update(state => ({...state, expandedAll: !expanedAll}));
  }

  onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(OrderActions.loadAll({
      param: this.mapRoute(this.formGroup.value)
    }));
  }

  mapRoute(val: any, isPagination?: boolean) {
    this.routeStore.update(state => ({
      ...state, search: val
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

  printRouter() {
    const value = this.formGroup.value;
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        filename: 'Danh sách tuyến đường từ ngày ' +
          this.datePipe.transform(value.startedAt_start, 'dd-MM-yyyy') +
          ' đến ngày ' + this.datePipe.transform(value.endedAt_end, 'dd-MM-yyyy'),
        title: 'Xuât bảng Tuyến đường',
        params: Object.assign(_.omit(value, ['take', 'skip']), {exportType: 'ROUTE'}),
        api: Api.SELL.ROUTE.ROUTE_EXPORT,
        selectDatetime: true,
        typeDate: 'RANGE_DATETIME'
      }
    });
  }

  compareDay(date: Date): boolean {
    return moment(date).isAfter(new Date(), 'day');
  }
}
