import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllCustomer } from '../../+state/customer.selector';
import { AppState } from '../../../../reducers';
import { CustomerAction } from '../../+state/customer.action';
import { CustomerResource, CustomerType, Gender } from '@minhdu-fontend/enums';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  templateUrl:'customer.component.html',
})
export class CustomerComponent implements OnInit {
  customerType = CustomerType;
  resourceType = CustomerResource;
  genderType = Gender;
  pageIndex: number = 1;
  pageSize: number = 30;
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
  ) {
  }

  customers$ = this.store.pipe(select(selectorAllCustomer));
  ngOnInit() {
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
      console.log('âssds');
      return {
        skip: pageSize * pageIndex++,
        take: this.pageSize,
        resource: val.resource ,
        isPotential: val.isPotential ,
        customerType: val.customerType ,
        nationId: val.nationId ,
        phone: val.phone ,
        name: val.name ,
      };
  }
  readAndUpdate($event?: any) {
    this.router.navigate(['customer/detail-customer', $event.id]).then();
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
}
