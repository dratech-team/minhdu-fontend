import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, CustomerResourcesConstant} from '@minhdu-fontend/constants';
import {CustomerType, ItemContextMenu, MenuEnum, SortCustomerEnum, SortRouteEnum} from '@minhdu-fontend/enums';
import {ExportService} from '@minhdu-fontend/service';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {debounceTime, tap} from 'rxjs/operators';
import {CustomerActions} from '../../+state/customer.actions';
import {OrderEntity} from '../../../order/enitities/order.interface';
import {CustomerDialogComponent} from '../../component/customer-dialog/customer-dialog.component';
import {PaymentDialogComponent} from '../../component/payment-dialog/payment-dialog.component';
import {PotentialTypes} from '../../constants/potentialTypes';
import {CustomerTypes} from '../../constants/customer.type';
import {GenderTypes} from '../../constants/generTypes';
import {Actions} from '@datorama/akita-ng-effects';
import {CustomerQuery} from '../../+state/customer.query';
import {RouteAction} from "../../../route/+state/route.action";
import {MatSort} from "@angular/material/sort";
import {NzModalService} from "ng-zorro-antd/modal";
import {OrderDialogComponent} from "../../../order/component/order-dialog/order-dialog.component";

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort

  customers$ = this.customerQuery.selectAll();
  loading$ = this.customerQuery.selectLoading();

  pageSize = 30;
  pageIndexInit = 0;
  customerType = CustomerType;
  resourceTypes = CustomerResourcesConstant;
  PotentialType = PotentialTypes;
  CustomerTypes = CustomerTypes;
  GenderTypes = GenderTypes;
  ItemContextMenu = ItemContextMenu;
  orders?: OrderEntity;
  sortCustomerEnum = SortCustomerEnum

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
    private readonly exportService: ExportService,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CustomerActions.loadAll({params: {take: this.pageSize, skip: this.pageIndexInit}}));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(
            CustomerActions.loadAll({params: this.mapCustomer(val, false)})
          );
        })
      )
      .subscribe();
  }

  addOrder($event?: any) {
    this.router.navigate(['/don-hang/them-don-hang'], {
      queryParams: {
        customerId: $event.id
      }
    }).then();
  }

  add($event?: any) {
    this.modal.create({
      nzTitle: 'Thêm khách hàng',
      nzContent: CustomerDialogComponent,
      nzViewContainerRef: this.viewContentRef,
      nzFooter: null,
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.actions$.dispatch(
      CustomerActions.loadAll(
        {
          params: this.mapCustomer(val, true),
          isScroll: true
        }
      )
    );
  }

  mapCustomer(val: any, isScroll: boolean) {
    const params = {
      skip: isScroll ? this.customerQuery.getCount() : this.pageIndexInit,
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
      note: val.note.trim(),
    };
    if (this.sort.active) {
      Object.assign(params, {
        orderBy: this.sort.active ? this.sort.active : '',
        orderType: this.sort ? this.sort.direction : ''
      });
    }
    return params
  }

  readAndUpdate($event?: any, isUpdate?: boolean) {
    this.router.navigate(['khach-hang/chi-tiet-khach-hang', $event.id], {
      queryParams: {
        isUpdate: isUpdate
      }
    }).then();
  }

  deleteCustomer($event: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {width: '25%'});
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CustomerActions.remove({id: $event.id}));
      }
    });
  }

  payment($event: any) {
    this.dialog.open(PaymentDialogComponent, {
      width: '55%',
      data: {id: $event.id}
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

  sortCustomer() {
    this.actions$.dispatch(RouteAction.loadAll({
      params: this.mapCustomer(this.formGroup.value, false)
    }));
  }
}
