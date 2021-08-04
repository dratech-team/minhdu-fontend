import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorCurrentCustomer } from '../../+state/customer/customer.selector';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerAction } from '../../+state/customer/customer.action';
import { Customer } from '../../+state/customer/customer.interface';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { FormGroup } from '@angular/forms';
import { PaidType } from 'libs/enums/paidType.enum';
import { Order } from '../../../order/+state/order.interface';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { PaymentHistory } from '@minhdu-fontend/data-models';
import { selectorAllOrders, selectorAllOrdersAssigned } from '../../../order/+state/order.selector';
import { OrderAction } from '../../../order/+state/order.action';




@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.store.pipe(select(selectorCurrentCustomer(this.getId)));
  OrdersNotAssigned$ = this.store.pipe(select(selectorAllOrders))
  OrdersAssigned$ = this.store.pipe(select(selectorAllOrdersAssigned))
  orders: Order[] = [];
  paymentHistories: PaymentHistory[] = [];
  formGroupOrder!: FormGroup;
  paidType =  PaidType;
  customer!: Customer
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(OrderAction.loadInit({take:30, skip: 0, customerId: this.getId }))
    this.store.dispatch(OrderAction.loadOrdersAssigned({take:30, skip: 0, customerId: this.getId , delivered: 1}))
    this.store.dispatch(CustomerAction.getCustomer({ id: this.getId }));
  }

  updateCustomer(customer: Customer) {
    this.dialog.open(CustomerDialogComponent , {
      data:customer ,
      width: '50%'
    })
  }
  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }
  deleteCustomer(id: any){
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '25%'
    })
    dialogRef.afterClosed().subscribe(val =>
      {
        if(val){
          this.store.dispatch(CustomerAction.deleteCustomer({id:id}))
        }
      }
    )
  }

  payment(id: number) {
     this.dialog.open(PaymentDialogComponent, {
          width: '55%',
          data: { id: id }
        });
  }

  development() {
    this.dialog.open(DevelopmentComponent,{width: '25%'})
  }
}


