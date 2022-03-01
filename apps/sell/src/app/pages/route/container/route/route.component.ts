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
import {
  DialogDeleteComponent
} from '../../../../../../../../libs/components/src/lib/dialog-delete/dialog-delete.component';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {Route} from "../../entities/route.entity";
import {RouteQuery} from "../../+state/route.query";
import {Actions} from "@datorama/akita-ng-effects";
import {RouteActions} from "../../+state/route.action";

@Component({
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {
  pageSize = 30;
  pageIndexInit = 0;
  ItemContextMenu = ItemContextMenu;
  today = new Date().getTime();
  statusRoute = StatusRoute;
  routes: Route[] = [];
  formGroup = new FormGroup({
    startedAt: new FormControl(''),
    endedAt: new FormControl(''),
    driver: new FormControl(''),
    name: new FormControl(''),
    bsx: new FormControl(''),
    garage: new FormControl(''),
    statusRoute: new FormControl('')
  });

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly routeQuery: RouteQuery,
    private readonly actions$: Actions,
  ) {
  }

  routes$ = this.routeQuery.selectAll()
  loaded$ = this.routeQuery.selectLoading()

  ngOnInit() {
    this.routes$.subscribe((val) => {
      this.routes = JSON.parse(JSON.stringify(val));
      this.routes.forEach((item) => {
        if (item.endedAt) {
          item.endedAt = new Date(item.endedAt);
        }
      });
    });

    this.actions$.dispatch(RouteActions.loadAll({take: this.pageSize, skip: this.pageIndexInit}))

    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(RouteActions.loadAll(this.route(val)));
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
    this.actions$.dispatch(RouteActions.loadAll(this.route(val, true)));
  }

  route(val: Route, isScroll?: boolean) {
    return Object.assign(val, {
      skip: isScroll ? this.routeQuery.getCount() : this.pageIndexInit,
      take: this.pageSize
    });
  }

  deleteRoute($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {
      width: 'fit-content'
    });
    ref.afterClosed().subscribe((value) => {
      if (value) {
        this.actions$.dispatch(RouteActions.remove({id: $event.id}));
      }
    });
  }

  onEnd(event: Route) {
    this.dialog
      .open(DialogDatePickerComponent)
      .afterClosed()
      .subscribe((datetime) => {
        if (datetime) {
          this.actions$.dispatch(
            RouteActions.update({id: event.id, updates: {endedAt: datetime}})
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
