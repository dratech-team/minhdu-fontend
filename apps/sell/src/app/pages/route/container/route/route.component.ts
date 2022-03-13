import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api} from '@minhdu-fontend/constants';
import {MenuEnum, StatusRoute} from '@minhdu-fontend/enums';
import {DialogDatePickerComponent} from 'libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import {DialogExportComponent} from 'libs/components/src/lib/dialog-export/dialog-export.component';
import {ItemContextMenu} from 'libs/enums/sell/page-type.enum';
import {debounceTime, tap} from 'rxjs/operators';
import {RouteAction} from '../../+state/route.action';
import {RouteEntity} from '../../entities/route.entity';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {Actions} from '@datorama/akita-ng-effects';
import {RouteQuery} from '../../+state/route.query';
import {DatePipe} from "@angular/common";

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  pageSize = 30;
  pageIndexInit = 0;
  ItemContextMenu = ItemContextMenu;
  today = new Date().getTime();
  statusRoute = StatusRoute;
  routes: RouteEntity[] = [];
  formGroup = new FormGroup({
    startedAt: new FormControl(),
    endedAt: new FormControl(''),
    driver: new FormControl(''),
    name: new FormControl(''),
    bsx: new FormControl(''),
    garage: new FormControl(''),
    statusRoute: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
  ) {
  }

  routes$ = this.routeQuery.selectAll();
  loading$ = this.routeQuery.selectLoading();

  ngOnInit() {
    this.routes$.subscribe((val) => {
      this.routes = JSON.parse(JSON.stringify(val));
      this.routes.forEach((item) => {
        if (item.endedAt) {
          item.endedAt = new Date(item.endedAt);
        }
      });
    });
    this.actions$.dispatch(
      RouteAction.loadAll({params: {take: this.pageSize, skip: this.pageIndexInit}})
    );
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(RouteAction.loadAll({params: this.route(val)}));
        })
      )
      .subscribe();
  }

  add() {
    this.dialog.open(RouteDialogComponent, {
      width: 'fit-content'
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(RouteAction.loadAll({params: this.route(val), isScroll: true}));
  }

  route(val: RouteEntity, isScroll?: boolean) {
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
      .subscribe((datetime) => {
        if (datetime) {
          this.actions$.dispatch(
            RouteAction.update({id: event.id, updates: {endedAt: datetime}})
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
}
