import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DevelopmentComponent, DialogDeleteComponent } from '@minhdu-fontend/components';
import { ConvertBoolean, MenuEnum, PaidType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../+state/customer/customer.action';
import { Customer } from '../../+state/customer/customer.interface';
import { selectorCurrentCustomer } from '../../+state/customer/customer.selector';
import { AppState } from '../../../../reducers';
import { OrderAction } from '../../../order/+state/order.action';
import { Order } from '../../../order/+state/order.interface';
import {
  selectedNotOrderLoaded,
  selectedOrderLoaded,
  selectorOrdersAssignedById,
  selectorOrdersNotAssignedById
} from '../../../order/+state/order.selector';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { MainAction } from '../../../../states/main.action';
import { getSelectors } from '@minhdu-fontend/utils';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  convertBoolean = ConvertBoolean;
  orders: Order[] = [];
  paidType = PaidType;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {
  }

  customer$ = this.store.select(selectorCurrentCustomer(this.getId));
  ordersNotAssigned$ = this.store.select(selectorOrdersNotAssignedById(this.getId));
  ordersAssigned$ = this.store.select(selectorOrdersAssignedById(this.getId));
  loadedOrdersAssigned$ = this.store.select(selectedOrderLoaded);
  loadedOrdersNotAssigned$ = this.store.select(selectedNotOrderLoaded);

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.CUSTOMER }));
    this.store.dispatch(CustomerAction.getCustomer({ id: this.getId }));
    this.store.dispatch(
      OrderAction.loadInit({ orderDTO: { take: 10, skip: 0, customerId: this.getId } })
    );
    this.store.dispatch(
      OrderAction.loadOrdersAssigned({
        take: 10,
        skip: 0,
        customerId: this.getId,
        status: this.convertBoolean.TRUE
      })
    );

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        this.updateCustomer(getSelectors(selectorCurrentCustomer(this.getId), this.store));
      }
    });
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
