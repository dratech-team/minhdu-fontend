import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DevelopmentComponent, DialogDeleteComponent } from '@minhdu-fontend/components';
import { ConvertBoolean, MenuEnum, PaidType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../+state/customer.action';
import { Customer } from '../../+state/customer.interface';
import { OrderAction } from '../../../order/+state/order.action';
import { Order } from '../../../order/+state/order.interface';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { MainAction } from '../../../../states/main.action';
import { CustomerQuery } from '../../+state/customer.query';
import { Actions } from '@datorama/akita-ng-effects';

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
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly dialog: MatDialog
  ) {
  }

  customer$ = this.customerQuery.selectEntity(this.getId);

  /// FIXME: Sửa lại logic
  ordersNotAssigned$ = this.customerQuery.selectAll();
  ordersAssigned$ = this.customerQuery.selectAll();
  loadedOrdersAssigned$ = this.customerQuery.selectLoading()
  loadedOrdersNotAssigned$ = this.customerQuery.selectLoading()

  ngOnInit() {
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.CUSTOMER }));
    this.actions$.dispatch(CustomerAction.getCustomer({ id: this.getId }));
    this.actions$.dispatch(
      OrderAction.loadInit({ orderDTO: { take: 10, skip: 0, customerId: this.getId } })
    );
    this.actions$.dispatch(
      OrderAction.loadOrdersAssigned({
        take: 10,
        skip: 0,
        customerId: this.getId,
        status: this.convertBoolean.TRUE
      })
    );

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        const customer = this.customerQuery.getEntity(this.getId);
        if (this.getId && customer) {
          this.updateCustomer(customer);
        }
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
        this.actions$.dispatch(CustomerAction.deleteCustomer({ id: id }));
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
