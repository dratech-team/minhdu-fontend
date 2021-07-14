import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Route } from '../+state/route.interface';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { selectorCurrentRoute } from '../+state/Route.selector';
import { ActivatedRoute } from '@angular/router';
import { RouteAction } from '../+state/route.action';
import { PaymentType } from '@minhdu-fontend/enums';

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
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.store.dispatch(RouteAction.getRoute({ id: this.routeId }));
  }

  updateRoute(route: Route) {
    this.dialog.open(RouteDialogComponent, {
      width: '30%',
      data: { route: route }
    });
  }

  get routeId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
}
