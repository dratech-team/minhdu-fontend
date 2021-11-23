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
  selectorOrdersAssignedById,
  selectorOrdersNotAssignedById,
  selectedOrderLoaded,
  selectedNotOrderLoaded
} from '../../../order/+state/order.selector';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { ConvertBoolean, MenuEnum } from '@minhdu-fontend/enums';
import { MainAction } from '../../../../states/main.action';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
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

  customer$ = this.store.pipe(select(selectorCurrentCustomer(this.getId)));
  ordersNotAssigned$ = this.store.pipe(select(selectorOrdersNotAssignedById(this.getId)));
  ordersAssigned$ = this.store.pipe(select(selectorOrdersAssignedById(this.getId)));
  loadedOrdersAssigned$ = this.store.pipe(select(selectedOrderLoaded));
  loadedOrdersNotAssigned$ = this.store.pipe(select(selectedNotOrderLoaded));

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.CUSTOMER}))
    this.store.dispatch(CustomerAction.getCustomer({ id: this.getId }));
    this.store.dispatch(
      OrderAction.loadInit({ take: 10, skip: 0, customerId: this.getId })
    );
    this.store.dispatch(
      OrderAction.loadOrdersAssigned({
        take: 10,
        skip: 0,
        customerId: this.getId,
        delivered: this.convertBoolean.TRUE
      })
    );
  }

  updateCustomer(customer: Customer) {
    this.dialog.open(CustomerDialogComponent, {
      data: { customer, isUpdate: true },
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
      width: 'fit-content',
      data: { id: id }
    });
  }

  development() {
    this.dialog.open(DevelopmentComponent, { width: '25%' });
  }
}
