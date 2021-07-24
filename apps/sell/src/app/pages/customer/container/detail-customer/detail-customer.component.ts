import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../reducers';
import { selectorCurrentCustomer } from '../../+state/customer.selector';
import { ActivatedRoute } from '@angular/router';
import { CustomerAction } from '../../+state/customer.action';
import { Customer } from '../../+state/customer.interface';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.store.pipe(select(selectorCurrentCustomer(this.getId)));
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
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
}


