import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorAllRoute } from '../+state/Route.selector';
import { RouteAction } from '../+state/route.action';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouteDialogComponent } from '../../component/route-dialog/route-dialog.component';
import { Router } from '@angular/router';
import { document } from 'ngx-bootstrap/utils';

@Component({
  templateUrl: 'route.component.html'
})
export  class RouteComponent implements OnInit{
  pageIndex: number = 1;
  pageSize: number = 30;
  formGroup!: FormGroup;
  routes$ = this.store.pipe(select(selectorAllRoute))
  constructor(
      private readonly store: Store<AppState>,
      private readonly dialog: MatDialog,
      private readonly router: Router,
  ) {
  }
  ngOnInit() {
    const btnRoute = document.getElementById('route')
    btnRoute?.classList.add('btn-border')
    document.getElementById('customer').classList.remove('btn-border')
    document.getElementById('order').classList.remove('btn-border')
    this.store.dispatch(RouteAction.loadInit({take:30, skip: 0}))
  }
  add(){
    this.dialog.open(RouteDialogComponent, {
      width: '50%',
    })
  }
  onScroll(){
    const val = this.formGroup.value
   this.store.dispatch(RouteAction.loadMoreRoutes(this.route(val,this.pageSize, this.pageIndex)))
  }
  route(val: any, pageSize: number, pageIndex: number){
    return {
      skip: pageSize *pageIndex++,
      take: pageSize
    }
  }

  deleteRoute($event: any){
    console.log($event.id)
      this.store.dispatch(RouteAction.deleteRoute({idRoute: $event.id}))
  }
  detailRoute(id: number){
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong',id]).then()
  }
}
