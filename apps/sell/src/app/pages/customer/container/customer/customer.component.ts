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

@Component({
  templateUrl:'customer.component.html',
})
export class CustomerComponent implements OnInit {
  customerType = CustomerType;
  resourceType = CustomerResource;
  genderType = Gender;
  constructor(
    private readonly store :Store<AppState>,
    private readonly router :Router,
    private readonly dialog : MatDialog,
  ) {
  }
  customers$ = this.store.pipe(select(selectorAllCustomer));
  ngOnInit() {
    this.store.dispatch(CustomerAction.loadInit({take:30, skip: 0}))
  }
  add($event?: any){
    this.dialog.open(CustomerDialogComponent, {
      width: '50%',
      data: $event
    })
  }
  onScroll() {
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
