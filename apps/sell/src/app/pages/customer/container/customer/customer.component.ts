import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api } from '@minhdu-fontend/constants';
import { ConvertBoolean, CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { select, Store } from '@ngrx/store';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { PageTypeEnum } from 'libs/enums/sell/page-type.enum';
import { document } from 'ngx-bootstrap/utils';
import { debounceTime, tap } from 'rxjs/operators';
import { CustomerAction } from '../../+state/customer/customer.action';
import { selectorAllCustomer } from '../../+state/customer/customer.selector';
import { AppState } from '../../../../reducers';
import { Order } from '../../../order/+state/order.interface';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  customerType = CustomerType;
  boolean = ConvertBoolean;
  resourceType = CustomerResource;
  pageType = PageTypeEnum;
  genderType = Gender;
  orders?: Order;
  pageIndex = 1;
  pageSize = 30;
  pageIndexInit = 0;
  formGroup = new FormGroup({
    resource: new FormControl(''),
    isPotential: new FormControl(''),
    customerType: new FormControl(''),
    nationId: new FormControl(''),
    phone: new FormControl(''),
    name: new FormControl(''),
    birthDay: new FormControl(''),
    gender: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    note: new FormControl('')
  });

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly exportService: ExportService
  ) {
  }

  customers$ = this.store.pipe(select(selectorAllCustomer));

  ngOnInit() {
    document.getElementById('customer').classList.add('btn-border');
    this.store.dispatch(CustomerAction.loadInit({ take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.store.dispatch(
            CustomerAction.loadInit(this.customer(val, this.pageSize,this.pageIndexInit))
          );
        })
      )
      .subscribe();
  }

  add($event?: any) {
    this.dialog.open(CustomerDialogComponent, {
      width: '50%',
      data: $event
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(
      CustomerAction.loadMoreCustomers(
        this.customer(val, this.pageSize)
      )
    );
  }

  customer(val: any, pageSize: number , pageIndex? : number) {
    return {
      skip: pageIndex === 0 ? pageSize * pageIndex: pageSize * this.pageIndex++,
      take: this.pageSize,
      resource: val.resource,
      isPotential:
        val.isPotential === 'true'
          ? this.boolean.TRUE
          : val.isPotential === 'false'
          ? this.boolean.FALSE
          : val.isPotential,
      customerType: val.customerType,
      nationId: val.nationId,
      phone: val.phone.trim(),
      customer: val.name.trim(),
      birthDay: val.birthDay,
      gender: val.gender,
      email: val.email.trim(),
      address: val.address.trim(),
      note: val.note.trim()
    };
  }

  readAndUpdate($event?: any) {
    this.router
      .navigate(['ban-hang/khach-hang/chi-tiet-khach-hang', $event.id])
      .then();
  }

  deleteCustomer($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '25%' });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.store.dispatch(CustomerAction.deleteCustomer({ id: $event.id }));
      }
    });
  }

  payment($event: any) {
    this.dialog.open(PaymentDialogComponent, {
      width: '55%',
      data: { id: $event.id }
    });
  }

  printCustomer() {
    const val = this.formGroup.value;
    const customers = {
      resource: val.resource,
      isPotential:
        val.isPotential === 'true'
          ? 1
          : val.isPotential === 'false'
          ? 0
          : val.isPotential,
      customerType: val.customerType,
      nationId: val.nationId,
      phone: val.phone.trim(),
      customer: val.name.trim(),
      birthDay: val.birthDay,
      gender: val.gender,
      email: val.email.trim(),
      address: val.address.trim(),
      note: val.note.trim()

    };
    this.exportService.print(Api.CUSTOMER_EXPORT, customers);
  }
}
