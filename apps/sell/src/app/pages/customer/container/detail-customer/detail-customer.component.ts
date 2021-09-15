import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DevelopmentComponent } from 'libs/components/src/lib/development/development.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { PaidType } from 'libs/enums/paidType.enum';
import { CustomerAction } from '../../+state/customer/customer.action';
import { Customer } from '../../+state/customer/customer.interface';
import { selectorCurrentCustomer } from '../../+state/customer/customer.selector';
import { AppState } from '../../../../reducers';
import { OrderAction } from '../../../order/+state/order.action';
import { Order } from '../../../order/+state/order.interface';
import {
  selectorOrdersAssignedById, selectorOrdersNotAssignedById
} from '../../../order/+state/order.selector';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { ConvertBoolean } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.store.pipe(select(selectorCurrentCustomer(this.getId)));
  ordersNotAssigned$ = this.store.pipe(select(selectorOrdersNotAssignedById(this.getId)));
  ordersAssigned$ = this.store.pipe(select(selectorOrdersAssignedById(this.getId)));
  convertBoolean = ConvertBoolean;
  orders: Order[] = [];
  paidType = PaidType;
  customer!: Customer;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.getCustomer({ id: this.getId }));
    this.store.dispatch(
      OrderAction.loadInit({ take: 30, skip: 0, customerId: this.getId })
    );
    this.store.dispatch(
      OrderAction.loadOrdersAssigned({
        take: 30,
        skip: 0,
        customerId: this.getId,
        delivered: this.convertBoolean.TRUE
      })
    );
  }

  updateCustomer(customer: Customer) {
    this.dialog.open(CustomerDialogComponent, {
      data: customer,
      width: '50%'
    });
  }

  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  deleteCustomer(id: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(CustomerAction.deleteCustomer({ id: id }));
      }
    });
  }

  payment(id: number) {
    this.dialog.open(PaymentDialogComponent, {
      width: '55%',
      data: { id: id }
    });
  }

  development() {
    this.dialog.open(DevelopmentComponent, { width: '25%' });
  }
}
