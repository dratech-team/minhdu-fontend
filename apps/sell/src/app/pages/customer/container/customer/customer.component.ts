import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Api, ResourcesConstant} from '@minhdu-fontend/constants';
import {CustomerType, ItemContextMenu, SortCustomerEnum} from '@minhdu-fontend/enums';
import {ExportService} from '@minhdu-fontend/service';
import {DialogDeleteComponent, DialogExportComponent} from '@minhdu-fontend/components';
import {debounceTime, map, tap} from 'rxjs/operators';
import {CustomerActions, CustomerQuery, CustomerStore} from '../../+state';
import {OrderEntity} from '../../../order/enitities';
import {CustomerDialogComponent, PaymentDialogComponent} from '../../component';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RadiosStatusRouteConstant} from '../../../../../../../../libs/constants/gender.constant';
import {CustomerConstant, PotentialsConstant} from '../../constants';
import {Sort} from '@minhdu-fontend/data-models';
import {OrderActions} from '../../../order/+state';
import * as _ from 'lodash';
@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  customers$ = this.customerQuery.selectAll().pipe(map(customers => JSON.parse(JSON.stringify(customers))));
  loading$ = this.customerQuery.selectLoading();
  total$ = this.customerQuery.select(state => state.total);
  ui$ = this.customerQuery.select(state => state.ui);

  pageSize = 25;
  pageIndexInit = 0;
  customerType = CustomerType;
  ItemContextMenu = ItemContextMenu;
  orders?: OrderEntity;
  sortCustomerEnum = SortCustomerEnum;
  radiosGender = RadiosStatusRouteConstant;
  potentialsConstant = PotentialsConstant;
  resourcesConstant = ResourcesConstant;
  customerConstant = CustomerConstant;
  pageSizeTable = 10;
  valueSort?: Sort;
  visible = false;
  stateSearch = this.customerQuery.getValue().search;

  formGroup = new FormGroup({
    resource: new FormControl(this.stateSearch.resource),
    isPotential: new FormControl(this.stateSearch.isPotential),
    type: new FormControl(this.stateSearch.type),
    gender: new FormControl(this.stateSearch.gender),
    search: new FormControl(this.stateSearch.search)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly customerStore: CustomerStore,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly exportService: ExportService,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CustomerActions.loadAll({search: this.mapCustomer(this.formGroup.value, false)}));
    this.formGroup.valueChanges
      .pipe(
        debounceTime(1000),
        tap((val) => {
          this.actions$.dispatch(
            CustomerActions.loadAll({search: this.mapCustomer(val, false)})
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

  add() {
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
    this.customerStore.update(state => ({
      ...state, search: val
    }));
    if (this.valueSort?.orderType) {
      Object.assign(val, this.valueSort);
    } else {
      delete val.orderBy;
      delete val.orderType;
    }
    return Object.assign({},val, {
      take: this.pageSize,
      skip: isPagination ? this.customerQuery.getCount() : 0
    });
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
    this.dialog.open(DialogExportComponent, {
      width: 'fit-content',
      data: {
        filename: 'danh sách khác hàng',
        title: 'Xuât bảng khác hàng',
        params: _.omit(this.mapCustomer(this.formGroup.value,false),['take','skip']),
        api: Api.SELL.CUSTOMER.CUSTOMER_EXPORT,
      }
    })
  }

  onPagination(pageIndex: number) {
    const value = this.formGroup.value;
    const count = this.customerQuery.getCount();
    if (pageIndex * this.pageSizeTable >= count) {
      this.actions$.dispatch(CustomerActions.loadAll({
        search: this.mapCustomer(value, true),
        isPaginate: true
      }));
    }
  }

  onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(OrderActions.loadAll({
      param: this.mapCustomer(this.formGroup.value, false)
    }));
  }
}
