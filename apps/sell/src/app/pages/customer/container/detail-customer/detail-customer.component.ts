import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DevelopmentComponent, DialogDeleteComponent } from '@minhdu-fontend/components';
import { ConvertBoolean, MenuEnum, PaidType } from '@minhdu-fontend/enums';
import { CustomerAction } from '../../+state/customer.action';
import { Customer } from '../../+state/customer.interface';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { MainAction } from '../../../../states/main.action';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery } from '../../+state/customer.query';
import { OrderEntity } from '../../../order/entities/order.entity';
import { of } from 'rxjs';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.customerQuery.selectEntity(this.getId);
  loadedOrdersAssigned$ = of(true);
  loadedOrdersNotAssigned$ = of(true);

  convertBoolean = ConvertBoolean;
  orders: OrderEntity[] = [];
  paidType = PaidType;

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.CUSTOMER }));
    this.actions$.dispatch(CustomerAction.getCustomer({ id: this.getId }));

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        // this.updateCustomer(this.customerQuery.getEntity(this.getId));
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
