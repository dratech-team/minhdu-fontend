import { Component, OnInit } from '@angular/core';
import { Route } from '../../+state/route.interface';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteAction } from '../../+state/route.action';
import { MenuEnum, PaymentType } from '@minhdu-fontend/enums';
import { MainAction } from '../../../../states/main.action';
import { DialogDatePickerComponent } from '@minhdu-fontend/components';
import { Actions } from '@datorama/akita-ng-effects';
import { RouteQuery } from '../../+state/route.query';

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  route$ = this.routeQuery.selectEntity(this.routeId);

  payType = PaymentType;

  constructor(
    private readonly actions$: Actions,
    private readonly routeQuery: RouteQuery,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.ROUTE }));
    this.actions$.dispatch(RouteAction.getRoute({ id: this.routeId }));

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true' && this.routeId) {
        this.updateRoute(this.routeQuery.getEntity(this.routeId));
      }
    });
  }

  updateRoute(route?: Route, selectOrder?: boolean) {
    this.dialog.open(RouteDialogComponent, {
      width: '60%',
      data: { route: route, selectOrder: selectOrder }
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
          this.actions$.dispatch(
            RouteAction.updateRoute({ route: { endedAt: val.day }, id: route.id })
          );
        }
      });
  }
}
