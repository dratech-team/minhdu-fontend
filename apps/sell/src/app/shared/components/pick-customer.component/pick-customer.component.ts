import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { Customer } from '../../../pages/customer/+state/customer/customer.interface';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { document } from 'ngx-bootstrap/utils';
import { PickCustomerService } from './pick-customer.service';
import { CustomerDialogComponent } from '../../../pages/customer/component/customer-dialog/customer-dialog.component';

@Component({
  selector: 'app-pick-customer',
  templateUrl: 'pick-customer.component.html'
})
export class PickCustomerComponent implements OnInit {
  @Input() customers: Customer[] = [];
  @Input() pickOne = false;
  @Output() checkEvent = new EventEmitter<number[]>();
  @Output() checkEventPickOne = new EventEmitter<number>();
  customerId!: number;
  resourceType = CustomerResource;
  customerType = CustomerType;
  pageIndex: number = 1;
  pageSize: number = 30;
  isSelectAll: boolean = false;
  customerIds: number[] = [];
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
      type: new FormControl(''),
      resource: new FormControl('')
    });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly service: PickCustomerService,
    private dialogRef: MatDialogRef<PickCustomerComponent>
  ) {
  }

  ngOnInit(): void {
    if (this.data.customers$) {
      this.data.customers$.subscribe(
        (val: Customer[]) =>
          this.customers = JSON.parse(JSON.stringify(val))
      );
    }
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        const val = this.formGroup.value;
        this.service.searchCustomer(this.customer(val, 30, 0));
        this.assignIsSelect();
      })
    ).subscribe();
  }

  onScroll() {
    const val = this.formGroup.value;
    this.service.scrollCustomer(this.customer(val, this.pageSize, this.pageIndex));
  }

  customer(val: any, pageSize: number, pageIndex: number) {
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      name: val.name.trim(),
      customerType: val.type,
      resource: val.resource
    };
  }

  assignIsSelect() {
    this.service.getCustomers().subscribe(val => {
      this.customers = JSON.parse(JSON.stringify(val));
      this.customers.forEach(e =>{
        if(this.customerId === e.id || this.customerIds.includes(e.id)){
          Object.assign(val, {isSelect: true})
        }else{
          Object.assign(val, {isSelect: this.isSelectAll})
        }
      });
    });
  }

  updateAllSelect(id: number) {
    const index = this.customerIds.indexOf(id);
    if (index > -1) {
      this.customerIds.splice(index, 1);
    } else {
      this.customerIds.push(id);
    }
    this.isSelectAll = this.customers !== null && this.customers.every(e => e.isSelect);
    this.checkEvent.emit(this.customerIds);
  }

  someComplete(): boolean {
    if (this.customers == null) {
      return false;
    }
    return (
      this.customers.filter(e => e.isSelect).length > 0 && !this.isSelectAll
    );
  }

  setAll(select: boolean) {
    this.isSelectAll = select;
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
