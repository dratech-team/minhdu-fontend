import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api, CustomerResourcesConstant } from '@minhdu-fontend/constants';
import { CustomerType, ItemContextMenu, MenuEnum } from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { Store } from '@ngrx/store';
import { DialogDeleteComponent, DialogExportComponent } from '@minhdu-fontend/components';
import { debounceTime, tap } from 'rxjs/operators';
import { CustomerAction } from '../../+state/customer.action';
import { AppState } from '../../../../reducers';
import { Order } from '../../../order/+state/order.interface';
import { CustomerDialogComponent } from '../../component/customer-dialog/customer-dialog.component';
import { PaymentDialogComponent } from '../../component/payment-dialog/payment-dialog.component';
import { MainAction } from '../../../../states/main.action';
import { PotentialTypes } from '../../constants/potentialTypes';
import { CustomerTypes } from '../../constants/customer.type';
import { GenderTypes } from '../../constants/generTypes';
import { Actions } from '@datorama/akita-ng-effects';
import { CustomerQuery } from '../../+state/customer.query';

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  pageSize = 30;
  pageIndexInit = 0;
  customerType = CustomerType;
  resourceTypes = CustomerResourcesConstant;
  PotentialType = PotentialTypes;
  CustomerTypes = CustomerTypes;
  GenderTypes = GenderTypes;
  ItemContextMenu = ItemContextMenu;
  orders?: Order;

  customers$ = this.customerQuery.selectAll();
  loading$ = this.customerQuery.selectLoading();

  formGroup = new FormGroup({
    name: new FormControl(''),
    resource: new FormControl(''),
    isPotential: new FormControl(),
    customerType: new FormControl(''),
    nationId: new FormControl(''),
    phone: new FormControl(''),
    birthDay: new FormControl(''),
    gender: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    note: new FormControl('')
  });

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(MainAction.updateStateMenu({ tab: MenuEnum.CUSTOMER }));
    this.actions$.dispatch(CustomerAction.loadAll({ take: this.pageSize, skip: this.pageIndexInit }));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(
            CustomerAction.loadAll(this.customer(val))
          );
        })
      )
      .subscribe();
  }

  addOrder($event?: any) {
    console.log();
    this.router.navigate(['/don-hang/them-don-hang'], {
      queryParams: {
        data: $event.id
      }
    }).then();
  }

  add($event?: any) {
    this.dialog.open(CustomerDialogComponent, {
      width: '50%',
      data: $event
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(
      CustomerAction.loadMoreCustomers(
        this.customer(val)
      )
    );
  }

  customer(val: any) {
    return {
      skip: 0,
      take: this.pageSize,
      resource: val.resource,
      isPotential: val.isPotential,
      customerType: val.customerType,
      nationId: val.nationId,
      phone: val.phone.trim(),
      name: val.name.trim(),
      birthDay: val.birthDay,
      gender: val.gender,
      email: val.email.trim(),
      address: val.address.trim(),
      note: val.note.trim()
    };
  }

  readAndUpdate($event?: any, isUpdate?: boolean) {
    this.router.navigate(['khach-hang/chi-tiet-khach-hang', $event.id], {
      queryParams: {
        isUpdate: isUpdate
      }
    }).then();
  }

  deleteCustomer($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, { width: '25%' });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CustomerAction.deleteCustomer({ id: $event.id }));
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
      isPotential: val.isPotential,
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
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        title: 'Xuât bảng khác hàng',
        exportType: 'CUSTOMER',
        params: customers,
        api: Api.SELL.CUSTOMER.CUSTOMER_EXPORT
      }
    });
  }
}
