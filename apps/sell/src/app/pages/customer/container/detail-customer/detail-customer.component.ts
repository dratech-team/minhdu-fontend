import { Component, OnInit } from '@angular/core';
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
import { DevelopmentComponent } from '../../../../../../../../libs/components/src/lib/development/development.component';


@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  orders: Order[] = [];
  formGroupOrder!: FormGroup;
  paidType =  PaidType;
  customer$ = this.store.pipe(select(selectorCurrentCustomer(this.getId)));
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(CustomerAction.getCustomer({ id: this.getId }));
    this.customer$.subscribe(val=> console.log(val))
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
      width: '40%',
      data: { id: id }
    });
  }

  development() {
    this.dialog.open(DevelopmentComponent,{width: '25%'})
  }
}


