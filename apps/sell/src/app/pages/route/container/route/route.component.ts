import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, RadiosStatusRouteConstant} from '@minhdu-fontend/constants';
import {SortRouteEnum} from '@minhdu-fontend/enums';
import {DialogDatePickerComponent} from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {DialogExportComponent} from 'libs/components/src/lib/dialog-export/dialog-export.component';
import {ItemContextMenu} from 'libs/enums/sell/page-type.enum';
import {debounceTime, map, tap} from 'rxjs/operators';
import {RouteAction} from '../../+state/route.action';
import {RouteEntity} from '../../entities/route.entity';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {Actions} from '@datorama/akita-ng-effects';
import {RouteQuery} from '../../+state/route.query';
import {DatePipe} from '@angular/common';
import {MatSort} from '@angular/material/sort';
import {getFirstDayInMonth, getLastDayInMonth} from '@minhdu-fontend/utils';
import {routes} from "../../../bill/bill-routing.module";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {OrderActions} from "../../../order/+state/order.actions";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 30;
  pageIndexInit = 0;
  ItemContextMenu = ItemContextMenu;
  today = new Date().getTime();
  sortRouteEnum = SortRouteEnum;
  formGroup = new FormGroup({
    search: new FormControl(),
    startedAt: new FormControl(
      this.datePipe.transform(getFirstDayInMonth(new Date()), 'yyyy-MM-dd')),
    endedAt: new FormControl(
      this.datePipe.transform(getLastDayInMonth(new Date()), 'yyyy-MM-dd')),
    driver: new FormControl(''),
    name: new FormControl(''),
    bsx: new FormControl(''),
    garage: new FormControl(''),
    status: new FormControl(-1)
  });
  radios = RadiosStatusRouteConstant

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly modal: NzModalService,
  ) {
  }

  routes$ = this.routeQuery.selectAll().pipe(map(routes => JSON.parse(JSON.stringify(routes))));
  loading$ = this.routeQuery.selectLoading();

  ngOnInit() {
    this.actions$.dispatch(RouteAction.loadAll({
        params: {
          take: this.pageSize,
          skip: this.pageIndexInit,
          startedAt: getFirstDayInMonth(new Date()),
          endedAt: getLastDayInMonth(new Date())
        }
      })
    );
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(RouteAction.loadAll({params: this.mapRoute(val)}));
        })
      )
      .subscribe();
  }

  add() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzFooter: null
    })
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(RouteAction.loadAll({params: this.mapRoute(val), isScroll: true}));
  }

  mapRoute(val: RouteEntity, isScroll?: boolean) {
    return Object.assign(val, {
      skip: isScroll ? this.routeQuery.getCount() : 0,
      take: this.pageSize
    });
  }

  deleteRoute($event: any) {
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
    console.log('route ', event);
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

  detailRoute(id: number, isUpdate: boolean) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id], {queryParams: {isUpdate}}).then();
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

  sortRoute() {
    this.actions$.dispatch(RouteAction.loadAll({
      params: this.mapRoute(this.formGroup.value)
    }));
  }

  onPickStartedDay($event: any) {
  }

  onPickEndedAtDay($event: any) {
  }

  paramChange(params: NzTableQueryParams) {
    const value = this.formGroup.value;
    params.sort.map(val => {
      if (val.value) {
        Object.assign(value, {
          orderBy: val.key,
          orderType: val.value === 'ascend' ? 'asc' : 'des'
        });
        this.actions$.dispatch(RouteAction.loadAll({
          params: this.mapRoute(value)
        }));
      }
    });
  }
}
