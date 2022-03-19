import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, ResourcesConstant} from '@minhdu-fontend/constants';
import {CustomerType, ItemContextMenu, SortCustomerEnum} from '@minhdu-fontend/enums';
import {ExportService} from '@minhdu-fontend/service';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {debounceTime, map, tap} from 'rxjs/operators';
import {CustomerActions} from '../../+state/customer.actions';
import {OrderEntity} from '../../../order/enitities/order.interface';
import {CustomerDialogComponent} from '../../component/customer-dialog/customer-dialog.component';
import {PaymentDialogComponent} from '../../component/payment-dialog/payment-dialog.component';
import {Actions} from '@datorama/akita-ng-effects';
import {CustomerQuery} from '../../+state/customer.query';
import {MatSort} from "@angular/material/sort";
import {NzModalService} from "ng-zorro-antd/modal";
import {RadiosStatusRouteConstant} from "../../../../../../../../libs/constants/gender.constant";
import {CustomerConstant} from "../../constants/customer.constant";
import {PotentialsConstant} from "../../constants/potentials.constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {RouteAction} from "../../../route/+state/route.action";
import {Sort} from "@minhdu-fontend/data-models";
import {OrderActions} from "../../../order/+state/order.actions";

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  customers$ = this.customerQuery.selectAll().pipe(map(customers => JSON.parse(JSON.stringify(customers))));
  loading$ = this.customerQuery.selectLoading();
  total$ = this.customerQuery.select(state => state.total)

  pageSize = 25;
  pageIndexInit = 0;
  customerType = CustomerType;
  ItemContextMenu = ItemContextMenu;
  orders?: OrderEntity;
  sortCustomerEnum = SortCustomerEnum
  radiosGender = RadiosStatusRouteConstant
  potentialsConstant = PotentialsConstant
  resourcesConstant = ResourcesConstant
  customerConstant = CustomerConstant
  pageSizeTable = 10
  valueSort?: Sort

  formGroup = new FormGroup({
    name: new FormControl(''),
    resource: new FormControl(''),
    isPotential: new FormControl(-1),
    customerType: new FormControl(''),
    nationId: new FormControl(''),
    phone: new FormControl(''),
    birthDay: new FormControl(''),
    gender: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    note: new FormControl(''),
    search: new FormControl('')
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

  mapCustomer(val: any, isPagination: boolean) {
    if (this.valueSort?.orderType) {
      Object.assign(val, this.valueSort)
    } else {
      delete val.orderBy
      delete val.orderType
    }

    Object.assign(val, {
      take: this.pageSize,
      skip: isPagination ? this.customerQuery.getCount() : 0
    })
    return val
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

  onPagination(pageIndex: number) {
    const value = this.formGroup.value
    const count = this.customerQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(CustomerActions.loadAll({
        params: this.mapCustomer(value, true),
        isPagination: true
      }))
    }
  }

  onSort(sort: Sort) {
    this.valueSort = sort
    this.actions$.dispatch(OrderActions.loadAll({
      param: this.mapCustomer(this.formGroup.value, false)
    }))
  }
}
