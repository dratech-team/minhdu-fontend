import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, RadiosStatusRouteConstant} from '@minhdu-fontend/constants';
import {SortRouteEnum} from '@minhdu-fontend/enums';
import {DialogDatePickerComponent} from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {DialogExportComponent} from 'libs/components/src/lib/dialog-export/dialog-export.component';
import {ItemContextMenu} from 'libs/enums/sell/page-type.enum';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import {RouteAction} from '../../+state/route.action';
import {RouteEntity} from '../../entities/route.entity';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {Actions} from '@datorama/akita-ng-effects';
import {RouteQuery} from '../../+state/route.query';
import {DatePipe} from '@angular/common';
import {OrderActions} from '../../../order/+state/order.actions';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RouteStore} from '../../+state/route.store';
import {Sort} from '@minhdu-fontend/data-models';

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  expandAll$ = this.routeQuery.select(state => state.expandedAll);
  routes$ = this.routeQuery.selectAll().pipe(map(routes => JSON.parse(JSON.stringify(routes))));
  loading$ = this.routeQuery.selectLoading();
  total$ = this.routeQuery.select(state => state.total);
  ui$ = this.routeQuery.select(state => state.ui)
  pageSize = 30;
  pageIndexInit = 0;
  pageSizeTable = 10;
  today = new Date().getTime();
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
          this.actions$.dispatch(RouteAction.loadAll({params: this.mapRoute(val)}));
        })
      )
      .subscribe();
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzFooter: null
    });
  }

  onRemove($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((value) => {
      if (value) {
        this.actions$.dispatch(RouteAction.remove({idRoute: $event.id}));
      }
    });
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
            RouteAction.update({id: event.id, updates: {endedAt: val.day}})
          );
        }
      });
  }

  onDetail(id: number, isUpdate: boolean) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id], {queryParams: {isUpdate}}).then();
  }

  onPickStartedDay($event: any) {
    this.formGroup.get('startedAt_start')?.setValue($event.start, {emitEvent: false})
    this.formGroup.get('startedAt_end')?.setValue($event.end)
  }

  onPickEndedAtDay($event: any) {
    this.formGroup.get('endedAt_start')?.setValue($event.start, {emitEvent: false})
    this.formGroup.get('endedAt_end')?.setValue($event.end)
  }

  onPagination(pageIndex: number) {
    const value = this.formGroup.value;
    const count = this.routeQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(RouteAction.loadAll({
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
    }))
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
    const val = this.formGroup.value;
    const route = {
      name: val.name.trim(),
      startedAt: val.startedAt,
      endedAt: val.endedAt,
      driver: val.driver.trim(),
      bsx: val.bsx.trim(),
      garage: val.garage.trim()
    };
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuât bảng Tuyến đường',
        exportType: 'ORDER',
        params: route,
        api: Api.SELL.ROUTE.ROUTE_EXPORT
      }
    });
  }
}
