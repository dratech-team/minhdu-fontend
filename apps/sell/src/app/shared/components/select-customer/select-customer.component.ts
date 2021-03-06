import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { CustomerEntity } from '../../../pages/customer/entities';
import { CustomerType, ModeEnum } from '@minhdu-fontend/enums';
import { CustomerModalComponent } from '../../../pages/customer/component';
import { CustomerActions, CustomerQuery } from '../../../pages/customer/state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CustomerTypeConstant, ResourcesConstant } from '../../../pages/customer/constants';
import { AccountQuery } from '../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { PaginationDto } from '@minhdu-fontend/constants';

@Component({
  selector: 'select-customer',
  templateUrl: 'select-customer.component.html'
})
export class SelectCustomerComponent implements OnInit {
  @Input() customers: CustomerEntity[] = [];
  @Input() pickOne = false;
  @Input() formGroup!: FormGroup;
  @Input() closeable = false;
  @Output() checkEvent = new EventEmitter<number[]>();
  @Input() data!: any;

  account$ = this.accountQuery.selectCurrentUser();
  remain$ = this.customerQuery.select(state => state.remain);
  loading$ = this.customerQuery.selectLoading();
  customers$ = this.customerQuery.selectAll();

  isSelectAll = false;
  customerIds: number[] = [];

  ResourcesConstant = ResourcesConstant;
  CustomerConstant = CustomerTypeConstant;
  CustomerType = CustomerType;
  ModeEnum = ModeEnum;

  formGroupCustomer = new FormGroup({
    name: new FormControl(''),
    type: new FormControl(''),
    resource: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef,
    private readonly modalRef: NzModalRef,
    private readonly customerQuery: CustomerQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit(): void {
    if (this.customers.length === 0) {
      this.customers$.subscribe((customers) => {
        this.customers = JSON.parse(JSON.stringify(customers));
      });
    }
    this.formGroupCustomer.valueChanges
      .pipe(debounceTime(500), startWith(this.formGroupCustomer.value))
      .subscribe((fg) => {
        this.actions$.dispatch(
          CustomerActions.loadAll({ search: this.mapToCustomer(fg) })
        );
      });
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Th??m kh??ch h??ng',
      nzContent: CustomerModalComponent,
      nzViewContainerRef: this.viewContentRef,
      nzFooter: null,
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  public onLoadMore() {
    const val = this.formGroupCustomer.value;
    this.actions$.dispatch(
      CustomerActions.loadAll({
        search: this.mapToCustomer(val, true),
        isSet: true
      })
    );
  }

  public updateAllSelect(id: number) {
    const index = this.customerIds.indexOf(id);
    if (index > -1) {
      this.customerIds.splice(index, 1);
    } else {
      this.customerIds.push(id);
    }
    this.isSelectAll =
      this.customers !== null &&
      this.customers.every((e) => this.customerIds.includes(e.id));
    this.checkEvent.emit(this.customerIds);
  }

  public someComplete(): boolean {
    if (this.customers == null) {
      return false;
    }
    return (
      this.customers.filter((e) => this.customerIds.includes(e.id)).length >
      0 && !this.isSelectAll
    );
  }

  public setAll(select: boolean) {
    this.isSelectAll = select;
    if (this.customers == null) {
      return;
    }
    this.customers?.forEach((customer) => {
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
    });
    this.checkEvent.emit(this.customerIds);
  }

  public closeDialog() {
    this.modalRef.close(this.formGroupCustomer.value);
  }

  private mapToCustomer(val: any, isScroll?: boolean) {
    return {
      skip: isScroll ? this.customerQuery.getCount() : 0,
      take: PaginationDto.take,
      lastName: val.name.trim(),
      type: val.type,
      resource: val.resource
    };
  }
}
