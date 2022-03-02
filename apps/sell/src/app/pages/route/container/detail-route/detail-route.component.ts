import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../reducers';
import {Route} from '../../+state/route.interface';
import {MatDialog} from '@angular/material/dialog';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {selectorCurrentRoute} from '../../+state/route.selector';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteAction} from '../../+state/route.action';
import {MenuEnum, PaymentType} from '@minhdu-fontend/enums';
import {MainAction} from '../../../../states/main.action';
import {getSelectors} from '@minhdu-fontend/utils';
import {
  DialogDatePickerComponent
} from "../../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component";

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  payType = PaymentType;

  route$ = this.store.select(selectorCurrentRoute(this.routeId));

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.ROUTE}));
    this.store.dispatch(RouteAction.getRoute({id: this.routeId}));

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        this.updateRoute(getSelectors(selectorCurrentRoute(this.routeId), this.store));
      }
    });
  }

  updateRoute(route: Route, selectOrder?: boolean) {
    this.dialog.open(RouteDialogComponent, {
      width: '60%',
      data: {route: route, selectOrder: selectOrder}
    });
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  detailOrder(orderId: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', orderId]).then();
  }

  completeRoute(route: Route) {
    this.dialog.open(DialogDatePickerComponent, {
      width: 'fit-content',
      data: {
        titlePopup: 'Hoàn tất tuyến đường',
        title: 'Ngày hoàn tất',
        dayInit: route.endedAt
      }
    }).afterClosed()
      .subscribe(val => {
        if (val) {
          this.store.dispatch(
            RouteAction.updateRoute({route: {endedAt: val.day}, id: route.id})
          )
        }
      })
  }
}
