import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Route } from '../+state/route.interface';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { selectorCurrentRoute } from '../+state/Route.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteAction } from '../+state/route.action';
import { PaymentType } from '@minhdu-fontend/enums';
import { document } from 'ngx-bootstrap/utils';

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {

  route$ = this.store.pipe(select(selectorCurrentRoute(this.routeId)));
  route!: Route;
  payType = PaymentType;
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    document.getElementById('route').classList.add('btn-border')
    document.getElementById('order').classList.remove('btn-border')
    this.store.dispatch(RouteAction.getRoute({ id: this.routeId }));
  }

  updateRoute(route: Route, selectOrder?: boolean) {
    this.dialog.open(RouteDialogComponent, {
      width: '60%',
      data: { route: route, selectOrder: selectOrder }
    });
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
  detailOrder(orderId: number){
    this.router.navigate(['don-hang/chi-tiet-don-hang', orderId]).then()
  }
}
