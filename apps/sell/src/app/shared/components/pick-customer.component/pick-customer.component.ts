import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { CustomerEntity } from '../../../pages/customer/entities';
import { CustomerResource, CustomerType } from '@minhdu-fontend/enums';
import { CustomerModalComponent } from '../../../pages/customer/component';
import { CustomerActions } from '../../../pages/customer/+state';
import { CustomerQuery } from '../../../pages/customer/+state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CustomerConstant, ResourcesConstant } from '../../../pages/customer/constants';

@Component({
  selector: 'app-pick-customer',
  templateUrl: 'pick-customer.component.html'
})
export class PickCustomerComponent implements OnInit {
  customers$ = this.customerQuery.selectAll();
  @Input() customers: CustomerEntity[] = [];
  @Input() pickOne = false;
  @Input() formGroup!:FormGroup;
  @Input() closeable = false;
  @Output() checkEvent = new EventEmitter<number[]>();
  @Input() data!: any;
  resourceType = CustomerResource;
  customerResourcesConstant = ResourcesConstant;
  CustomerTypeConstant = CustomerConstant;
  customerType = CustomerType;
  pageSize = 30;
  pageIndexInit = 0;
  pageSizeTable = 5;
  isSelectAll = false;
  customerIds: number[] = [];
  formGroupCustomer = new FormGroup(
    {
      name: new FormControl(''),
      type: new FormControl(''),
      resource: new FormControl('')
    });

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef,
    private readonly modalRef: NzModalRef,
  ) {
  }

  ngOnInit(): void {
    if (this.customers.length === 0) {
      this.actions$.dispatch(CustomerActions.loadAll({ search: { take: 30, skip: 0 } }));
      this.customers$.subscribe(customers => {
        this.customers = JSON.parse(JSON.stringify(customers));
      });
    }
    this.formGroupCustomer.valueChanges.pipe(
      debounceTime(1000),
      tap((value) => {
        this.actions$.dispatch(CustomerActions.loadAll({ search: this.customer(value) }));
      })
    ).subscribe();
  }

  onPagination(pageIndex: number) {
    const count = this.customerQuery.getCount();
    const val = this.formGroupCustomer.value;
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(CustomerActions.loadAll({
        search: this.customer(val, true),
        isPaginate: true
      }));
    }
  }

  customer(val: any, isScroll?: boolean) {
    return {
      skip: isScroll ? this.customerQuery.getCount() : 0,
      take: this.pageSize,
      lastName: val.name.trim(),
      type: val.type,
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


  closeDialog() {
    this.modalRef.close(this.formGroupCustomer.value);
  }

  addCustomer() {
    this.modal.create({
      nzTitle: 'Thêm khách hàng',
      nzContent: CustomerModalComponent,
      nzViewContainerRef: this.viewContentRef,
      nzFooter: null,
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }
}
