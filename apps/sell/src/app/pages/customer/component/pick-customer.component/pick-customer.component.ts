import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { selectorAllCustomer } from '../../+state/customer.selector';
import { CustomerAction } from '../../+state/customer.action';
import { Customer } from '../../+state/customer.interface';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { document } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-pick-customer',
  templateUrl: 'pick-customer.component.html'
})
export class PickCustomerComponent implements OnInit {
  @Input() pickPOne: boolean | undefined;
  @Output() checkEvent = new EventEmitter();
  customerId!: number;
  resourceType = CustomerResource;
  customerType = CustomerType;
  pageIndex: number = 1;
  pageSize: number = 30;
  selectAll: boolean = false;
  customers: Customer[] = [];
  customerIds: number[] = [];
  customers$ = this.store.pipe(select(selectorAllCustomer));
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      type: new FormControl(''),
      resource: new FormControl('')
    });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store,
    private dialogRef: MatDialogRef<PickCustomerComponent>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(CustomerAction.loadInit({ skip: 0, take: 30 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((val) => {
        this.store.dispatch(CustomerAction.loadInit({
          skip: 0,
          take: 30
        }));
      })
    ).subscribe();
    this.customers$.subscribe(val => {
      this.customers = JSON.parse(JSON.stringify(val));
      this.customers.map(e => e.isSelect = this.selectAll);
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(CustomerAction.loadMoreCustomers({
      take: this.pageSize,
      skip: this.pageSize * this.pageIndex++
    }));
  }

  updateAllSelect(id: number) {
    const index = this.customerIds.indexOf(id);
    if (index > -1) {
      this.customerIds.splice(index, 1);
    } else {
      this.customerIds.push(id);
    }
    this.selectAll = this.customers !== null && this.customers.every(e => e.isSelect);
    this.checkEvent.emit(this.customerIds);
  }

  someComplete(): boolean {
    if (this.customers == null) {
      return false;
    }
    return (
      this.customers.filter(e => e.isSelect).length > 0 && !this.selectAll
    );
  }

  setAll(select: boolean) {
    this.selectAll = select;
    if (this.customers == null) {
      return;
    }
    this.customerIds = [];
    this.customers?.forEach(customer => {
        customer.isSelect = select;
        if (select) {
          this.customerIds.push(customer.id);
        }
      }
    );
    this.checkEvent.emit(this.customerIds);
  }

  close() {
    const pickCustomer = document.getElementsByName('pick-one');
    for (let i = 0; i < pickCustomer.length; i++) {
      if (pickCustomer[i].checked) {
        this.customerId = pickCustomer[i].value;
      }
    }
    this.dialogRef.close(this.customerId);
  }
}
