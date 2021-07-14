import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllRoute } from '../+state/Route.selector';
import { RouteAction } from '../+state/route.action';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'route.component.html'
})
export  class RouteComponent implements OnInit{
  formGroup!: FormGroup;
  routes$ = this.store.pipe(select(selectorAllRoute))
  constructor(
      private readonly store: Store<AppState>,
      private readonly dialog: MatDialog,
      private readonly router: Router,
  ) {
  }
  ngOnInit() {
    this.store.dispatch(RouteAction.loadInit({take:30, skip: 0}))
  }
  add(){
    this.dialog.open(RouteDialogComponent, {
      width: '45%',
    })
  }
  onScroll(){

  }
  deleteRoute($event: any){

  }
  detailRoute(id: number){
    this.router.navigate(['route/detail-route',id]).then()
  }

}
