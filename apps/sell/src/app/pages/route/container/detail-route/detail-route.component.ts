import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RouteDialogComponent} from '../../component/route-dialog/route-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuEnum, PaymentType} from '@minhdu-fontend/enums';
import {RouteQuery} from "../../+state/route.query";
import {Actions} from "@datorama/akita-ng-effects";
import {RouteActions} from "../../+state/route.action";
import {Route} from "../../entities/route.entity";

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  payType = PaymentType;

  route$ = this.routeQuery.selectEntity(this.routeId);

  constructor(
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly routeQuery: RouteQuery,
    private readonly actions$: Actions,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(RouteActions.getOne({id: this.routeId}));

    this.activatedRoute.queryParams.subscribe(param => {
      const route = this.routeQuery.getEntity(this.routeId)
      if (param.isUpdate === 'true' && route) {
        this.updateRoute(route, true);
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
}
