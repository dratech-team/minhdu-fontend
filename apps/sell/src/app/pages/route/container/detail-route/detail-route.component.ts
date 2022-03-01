import {Component, OnInit} from '@angular/core';
import {Route} from '../../+state/route.interface';
import {MatDialog} from '@angular/material/dialog';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {selectorCurrentRoute} from '../../+state/route.selector';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteAction} from '../../+state/route.action';
import {MenuEnum, PaymentType} from '@minhdu-fontend/enums';
import {MainAction} from '../../../../states/main.action';
import {getSelectors} from '@minhdu-fontend/utils';
import { DialogDatePickerComponent } from "@minhdu-fontend/components";
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  route$ = this.actions$.select(selectorCurrentRoute(this.routeId));

  payType = PaymentType;

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(MainAction.updateStateMenu({tab: MenuEnum.ROUTE}));
    this.actions$.dispatch(RouteAction.getRoute({id: this.routeId}));

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
