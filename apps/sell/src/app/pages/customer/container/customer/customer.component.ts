import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api, GenderTypeConstant } from '@minhdu-fontend/constants';
import {
  CustomerResource,
  CustomerType,
  GenderTypeEnum,
  ItemContextMenu,
  SortTypeCustomerEnum
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { ModalExportExcelComponent, ModalExportExcelData } from '@minhdu-fontend/components';
import { startWith, tap } from 'rxjs/operators';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../+state';
import { CustomerModalComponent, PaymentModalComponent } from '../../component';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RadiosStatusRouteConstant } from '../../constants/gender.constant';
import { CustomerConstant, PotentialsConstant, ResourcesConstant } from '../../constants';
import { ContextMenuEntity, Sort } from '@minhdu-fontend/data-models';
import { OrderActions } from '../../../order/+state';
import * as _ from 'lodash';
import { OrderEntity } from '../../../order/enitities/order.entity';
import { CustomerEntity } from '../../entities';
import { ModalAddOrUpdatePayment } from '../../data/modal-payment.data';
import { PotentialEnum } from '../../enums';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { ModalCustomerData } from '../../data/modal-customer.data';

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  @ViewChild('menu') menu: any;
  orders?: OrderEntity;
  valueSort?: Sort;

  customers$ = this.customerQuery.selectAll();
  total$ = this.customerQuery.select((state) => state.total);
  count$ = this.customerQuery.selectCount();
  remain$ = this.customerQuery.select((state) => state.remain);
  loading$ = this.customerQuery.selectLoading();
  ui$ = this.customerQuery.select((state) => state.ui);

  pageSize = 25;
  pageIndexInit = 0;
  pageSizeTable = 10;
  visible = false;
  search = this.customerQuery.getValue().search;
  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: any) => this.onUpdate(data)
    },
    {
      title: 'Xoá',
      click: (data: any) => this.onRemove(data)
    }
  ];

  CustomerType = CustomerType;
  ItemContextMenu = ItemContextMenu;
  SortTypeCustomerEnum = SortTypeCustomerEnum;
  RadiosStatusRouteConstant = RadiosStatusRouteConstant;
  PotentialsConstant = PotentialsConstant;
  ResourcesConstant = ResourcesConstant;
  CustomerConstant = CustomerConstant;
  GenderTypeConstant = GenderTypeConstant;

  formGroup = new FormGroup({
    search: new FormControl<string>(''),
    gender: new FormControl<GenderTypeEnum>(GenderTypeEnum.ALL),
    isPotential: new FormControl<PotentialEnum>(PotentialEnum.ALL),
    resource: new FormControl<CustomerResource>(CustomerResource.ALL),
    type: new FormControl<CustomerType>(CustomerType.ALL)
  });

  constructor(
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly customerStore: CustomerStore,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly exportService: ExportService,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef,
    private readonly nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(
        tap((val) => {
          this.actions$.dispatch(
            CustomerActions.loadAll({ search: this.mapCustomer(val, false) })
          );
        })
      )
      .subscribe();
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Thêm khách hàng',
      nzContent: CustomerModalComponent,
      nzViewContainerRef: this.viewContentRef,
      nzFooter: [],
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  onDetail(customer: CustomerEntity) {
    this.router
      .navigate(['khach-hang/chi-tiet-khach-hang', customer.id])
      .then();
  }

  onUpdate(customer: CustomerEntity) {
    this.modal.create({
      nzWidth: '65vw',
      nzTitle: 'Sửa khách hàng',
      nzContent: CustomerModalComponent,
      nzComponentParams: <{ data?: ModalCustomerData }>{
        data: { update: { customer } }
      },
      nzFooter: []
    });
  }

  onRemove(customer: CustomerEntity) {
    this.modal.warning({
      nzTitle: 'Xoá khách hàng',
      nzContent: `Bạn có chắc chắn muốn xoá khác hàng ${customer.lastName}`,
      nzOnOk: () => {
        return this.actions$.dispatch(CustomerActions.remove({ id: customer.id }));
      }

    });
  }

  public addOrder($event?: any) {
    this.router.navigate(['/don-hang/them-don-hang'], {
      queryParams: {
        customerId: $event.id
      }
    }).then();
  }

  public onPayment(customer: CustomerEntity) {
    this.modal.create({
      nzWidth: '70vw',
      nzTitle: 'Thanh toán',
      nzContent: PaymentModalComponent,
      nzComponentParams: <{ data: ModalAddOrUpdatePayment }>{
        data: {
          add: {
            customer: customer
          }
        }
      },
      nzFooter: []
    }).afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CustomerActions.loadOne({ id: customer.id }));
      }
    });
  }

  public printCustomer() {
    this.modal.create({
      nzTitle: 'Xuất danh sách khách hàng',
      nzWidth: 'fit-content',
      nzContent: ModalExportExcelComponent,
      nzComponentParams: <{ data: ModalExportExcelData }>{
        data: {
          filename: 'Danh sách khách hàng',
          params: Object.assign(
            {},
            _.omit(this.mapCustomer(this.formGroup.value, false), [
              'take',
              'skip'
            ]),
            { exportType: 'CUSTOMER' }
          ),
          api: Api.HR.EMPLOYEE.EMPLOYEE_EXPORT
        }
      },
      nzFooter: []
    });
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  public onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll(this.mapCustomer(this.formGroup.value, true))
    );
  }

  public onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      OrderActions.loadAll({
        param: this.mapCustomer(this.formGroup.value, false)
      })
    );
  }

  private mapCustomer(val: any, isPagination: boolean) {
    this.customerStore.update((state) => ({
      ...state,
      search: val
    }));
    if (this.valueSort?.orderType) {
      Object.assign(val, this.valueSort);
    } else {
      delete val.orderBy;
      delete val.orderType;
    }
    return Object.assign({}, val, {
      take: this.pageSize,
      skip: isPagination ? this.customerQuery.getCount() : 0
    });
  }
}
