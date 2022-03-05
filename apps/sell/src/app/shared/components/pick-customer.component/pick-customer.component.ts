import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { CustomerEntity } from '../../../pages/customer/entities/customer.interface';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { document } from 'ngx-bootstrap/utils';
import { PickCustomerService } from './pick-customer.service';
import { CustomerDialogComponent } from '../../../pages/customer/component/customer-dialog/customer-dialog.component';
import { CustomerResourcesConstant, CustomerTypeConstant } from '@minhdu-fontend/constants';
import { CustomerAction } from '../../../pages/customer/+state/customer.action';
import { CustomerQuery } from '../../../pages/customer/+state/customer.query';
import { Actions } from '@datorama/akita-ng-effects';

@Component({
  selector: 'app-pick-customer',
  templateUrl: 'pick-customer.component.html'
})
export class PickCustomerComponent implements OnInit {
  customers$ = this.customerQuery.selectAll();

  @Input() customers: CustomerEntity[] = [];
  @Input() pickOne = false;
  @Output() checkEvent = new EventEmitter<number[]>();
  @Output() checkEventPickOne = new EventEmitter<number>();
  customerId!: number;
  resourceType = CustomerResource;
  customerResourcesConstant = CustomerResourcesConstant;
  CustomerTypeConstant = CustomerTypeConstant;
  customerType = CustomerType;
  pageSize = 30;
  pageIndexInit = 0;
  isSelectAll = false;
  customerIds: number[] = [];
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      type: new FormControl(''),
      resource: new FormControl('')
    });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly dialog: MatDialog,
    private readonly service: PickCustomerService,
    private dialogRef: MatDialogRef<PickCustomerComponent>
  ) {
  }

  ngOnInit(): void {
    if (this.customers.length === 0) {
      this.actions$.dispatch(CustomerAction.loadAll({ take: 30, skip: 0 }));
      this.customers$.subscribe(customers => {
        this.customers = JSON.parse(JSON.stringify(customers));
      });
    }
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        this.service.searchCustomer(this.customer(value));
      })
    ).subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.service.scrollCustomer(this.customer(val));
  }

  customer(val: any) {
    return {
      skip: 0,
      take: this.pageSize,
      customer: val.name.trim(),
      customerType: val.type,
      resource: val.resource
    };
  }

  updateAllSelect(id: number) {
    const index = this.customerIds.indexOf(id);
    if (index > -1) {
      this.customerIds.splice(index, 1);
    } else {
      this.customerIds.push(id);
    }
    this.isSelectAll = this.customers !== null && this.customers.every(e => this.customerIds.includes(e.id));
    this.checkEvent.emit(this.customerIds);
  }

  someComplete(): boolean {
    if (this.customers == null) {
      return false;
    }
    return (
      this.customers.filter(e => this.customerIds.includes(e.id)).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.customers == null) {
      return;
    }
    this.customers?.forEach(customer => {
        if (select) {
          if (!this.customerIds.includes(customer.id)) {
            this.customerIds.push(customer.id);
          }
        } else {
          const index = this.customerIds.indexOf(customer.id);
          if (index > -1) {
            this.customerIds.splice(index, 1);
          }
        }
      }
    );
    this.checkEvent.emit(this.customerIds);
  }

  pickOneCustomer() {
    const pickCustomer = document.getElementsByName('pick-one');
    for (let i = 0; i < pickCustomer.length; i++) {
      if (pickCustomer[i].checked) {
        this.customerId = parseInt(pickCustomer[i].value);
      }
    }
    this.checkEventPickOne.emit(this.customerId);
  }

  closeDialog() {
    const pickCustomer = document.getElementsByName('pick-one');
    for (let i = 0; i < pickCustomer.length; i++) {
      if (pickCustomer[i].checked) {
        this.customerId = parseInt(pickCustomer[i].value);
      }
    }
    this.dialogRef.close(this.customerId);
  }

  addCustomer() {
    this.dialog.open(CustomerDialogComponent, {
      width: '40%'
    });
  }
}
