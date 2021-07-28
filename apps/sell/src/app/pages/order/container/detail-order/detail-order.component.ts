import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorCurrentOrder } from '../../+state/order.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../+state/order.interface';
import { CommodityUnit, PaymentType } from '@minhdu-fontend/enums';
import { OrderAction } from '../../+state/order.action';
import { OrderDialogComponent } from '../../component/order-dialog/order-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { document } from 'ngx-bootstrap/utils';

@Component({
  templateUrl:'detail-order.component.html',
})
export class DetailOrderComponent implements OnInit {
  order$ = this.store.pipe(select(selectorCurrentOrder(this.getOrderId)))
  order!: Order
  payType =  PaymentType;
  commodityUnit = CommodityUnit;
  constructor(
    private readonly store: Store<AppState>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }
  ngOnInit() {
    const btnOrder = document.getElementById('order');
    btnOrder?.classList.add('btn-border');
    document.getElementById('route').classList.remove('btn-border')
    document.getElementById('customer').classList.remove('btn-border')
    this.store.dispatch(OrderAction.getOrder({id:this.getOrderId}))
  }
  get getOrderId():number{
    return this.activatedRoute.snapshot.params.id;
  }
  updateOrder(order:Order){
    this.dialog.open(OrderDialogComponent, {width: '40%', data:{order:order, type:"UPDATE"}})
  }

  detailRoute(id: number) {
    this.router.navigate(['tuyen-duong/chi-tiet-tuyen-duong', id ]).then()
  }
}
