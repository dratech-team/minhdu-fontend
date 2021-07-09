import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { Route } from '../+state/route.interface';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';

@Component({
  templateUrl: 'detail-route.component.html'
})
export class DetailRouteComponent implements OnInit {
  route!: Route;
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
  ) {
  }
  ngOnInit() {
  }
  updateRoute(route:Route){
    this.dialog.open(RouteDialogComponent, {
      width: '30%',
      data: {route: route}
    })
  }
}
