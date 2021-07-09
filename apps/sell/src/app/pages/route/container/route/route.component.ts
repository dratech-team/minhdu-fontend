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
  // routes$ = this.store.pipe(select(selectorAllRoute))
  routes = [
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
    {
      name: 'Hà Nội',
      startedAt: new Date(),
      endedAt: new Date(),
      driver: {
        firstName: 'Trần',
        lastName: 'Hiệu',
      },
      orders: [],
      bsx: '77G1-54487',
      latitude: 11,
      longitude: 12,
    },
  ];
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
      width: '30%',
    })
  }
  onScroll(){

  }
  deleteRoute($event: any){

  }
  detailRoute(){
    this.router.navigate(['route/detail-route']).then()
  }

}
