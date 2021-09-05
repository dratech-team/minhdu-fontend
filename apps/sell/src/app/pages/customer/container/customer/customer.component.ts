import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllCustomer } from '../../+state/customer/customer.selector';
import { AppState } from '../../../../reducers';
import { CustomerAction } from '../../+state/customer/customer.action';
import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { Order } from '../../../order/+state/order.interface';
import { document } from 'ngx-bootstrap/utils';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';
import { ExportCustomerService } from '../../service/export-customer.service';

@Component({
  templateUrl:'customer.component.html',
})
export class CustomerComponent implements OnInit {
  customerType = CustomerType;
  resourceType = CustomerResource;
  pageType = PageTypeEnum;
  genderType = Gender;
  orders?:Order;
  pageIndex = 1;
  pageSize = 30;
  formGroup = new FormGroup(
    {
      resource: new FormControl(''),
      isPotential: new FormControl(''),
      customerType: new FormControl(''),
      nationId: new FormControl(''),
      phone: new FormControl(''),
      name: new FormControl(''),
    }
  );
  constructor(
    private readonly store :Store<AppState>,
    private readonly router :Router,
    private readonly dialog : MatDialog,
    private readonly exportCustomerService : ExportCustomerService,
  ) {
  }

  customers$ = this.store.pipe(select(selectorAllCustomer));
  ngOnInit() {
    document.getElementById('customer').classList.add('btn-border')
    this.store.dispatch(CustomerAction.loadInit({take:30, skip: 0}))
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(CustomerAction.loadInit(this.customer(val, 30, 0 )));
      })
    ).subscribe()
  }
  add($event?: any){
    this.dialog.open(CustomerDialogComponent, {
      width: '50%',
      data: $event
    })
  }
  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(CustomerAction.loadMoreCustomers(this.customer(val, this.pageSize, this.pageIndex)));
  }
  customer(val: any, pageSize: number, pageIndex: number) {
      return {
        skip: pageSize * pageIndex++,
        take: this.pageSize,
        resource: val.resource ,
        isPotential: val.isPotential === 'true'? 1 :
          val.isPotential === 'false'? 0 : val.isPotential,
        customerType: val.customerType ,
        nationId: val.nationId ,
        phone: val.phone.trim() ,
        name: val.name.trim(),
      };
  }
  readAndUpdate($event?: any) {
    this.router.navigate(['ban-hang/khach-hang/chi-tiet-khach-hang', $event.id]).then();
  }
  deleteCustomer($event: any){
    const dialogRef = this.dialog.open(DialogDeleteComponent, {width: '25%',})
    dialogRef.afterClosed().subscribe(val =>
      {
        if(val){
          this.store.dispatch(CustomerAction.deleteCustomer({id: $event.id}))
        }
      }
    )
  }

  payment($event: any) {
    this.dialog.open(PaymentDialogComponent, {
      width: '55%',
      data: { id: $event.id }
    });
  }

  printCustomer() {
    const val = this.formGroup.value
    const customers = {
      resource: val.resource ,
      isPotential: val.isPotential === 'true'? 1 :
        val.isPotential === 'false'? 0 : val.isPotential,
      customerType: val.customerType ,
      nationId: val.nationId ,
      phone: val.phone.trim() ,
      name: val.name.trim(),
    }
    this.exportCustomerService.print(customers).subscribe()
  }
}
