import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Api, GenderTypeConstant } from '@minhdu-fontend/constants';
import {
  CustomerResource,
  CustomerType,
  GenderTypeEnum,
  ItemContextMenu,
  ModeEnum,
  SortTypeCustomerEnum
} from '@minhdu-fontend/enums';
import { ExportService } from '@minhdu-fontend/service';
import { ModalExportExcelComponent, ModalExportExcelData } from '@minhdu-fontend/components';
import { CustomerActions, CustomerQuery, CustomerStore } from '../../state';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CustomerConstant, PotentialsConstant, ResourcesConstant } from '../../constants';
import { ContextMenuEntity, Sort } from '@minhdu-fontend/data-models';
import * as _ from 'lodash';
import { OrderEntity } from '../../../order/enitities';
import { CustomerEntity } from '../../entities';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { AccountQuery } from '../../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { debounceTime, startWith } from 'rxjs/operators';
import { RadiosStatusRouteConstant } from '../../../route/constants';
import { PotentialEnum } from '../../enums';
import { CustomerComponentService } from '../../shared';

@Component({
  templateUrl: 'customer.component.html'
})
export class CustomerComponent implements OnInit {
  orders?: OrderEntity;
  valueSort?: Sort;

  total$ = this.customerQuery.select((state) => state.total);
  count$ = this.customerQuery.selectCount();
  remain$ = this.customerQuery.select((state) => state.remain);
  loading$ = this.customerQuery.selectLoading();
  ui$ = this.customerQuery.select((state) => state.ui);
  account$ = this.accountQuery.selectCurrentUser();
  customers$ = this.customerQuery.selectAll();

  visible = false;
  search = this.customerQuery.getValue().search;
  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.customerComponentService.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: CustomerEntity) => this.customerComponentService.onUpdate(data)
    },
    {
      title: 'Xoá',
      click: (data: CustomerEntity) => this.customerComponentService.onRemove(data)
    },
    {
      title: 'Thanh toán',
      click: (data: CustomerEntity) => this.customerComponentService.onPayment(data)
    }
  ];

  CustomerType = CustomerType;
  ModeEnum = ModeEnum;
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
    public readonly customerComponentService: CustomerComponentService,
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly accountQuery: AccountQuery,
    private readonly customerStore: CustomerStore,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly exportService: ExportService,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(debounceTime(500), startWith(this.formGroup.value))
      .subscribe((formGroup) => {
        this.actions$.dispatch(
          CustomerActions.loadAll({ search: this.mapCustomer(formGroup), isSet: true })
        );
      });

  }

  public addOrder($event?: any) {
    this.router.navigate(['/don-hang/them-don-hang'], {
      queryParams: {
        customerId: $event.id
      }
    }).then();
  }

  public onExport() {
    this.modal.create({
      nzTitle: 'Xuất danh sách khách hàng',
      nzWidth: 'fit-content',
      nzContent: ModalExportExcelComponent,
      nzComponentParams: <{ data: ModalExportExcelData }>{
        data: {
          filename: 'Danh sách khách hàng',
          params: Object.assign(
            {},
            _.omit(this.mapCustomer(this.formGroup.value), [
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
      CustomerActions.loadAll({ search: this.mapCustomer(this.formGroup.value), isSet: false })
    );
  }

  public onSort(sort: Sort) {
    this.valueSort = sort;
    this.actions$.dispatch(
      CustomerActions.loadAll({ search: this.mapCustomer(this.formGroup.value), isSet: true })
    );
  }

  private mapCustomer(search: any) {
    this.customerStore.update((state) => ({
      ...state,
      search: search
    }));
    if (this.valueSort?.orderType) {
      Object.assign(search, this.valueSort);
    } else {
      delete search.orderBy;
      delete search.orderType;
    }
    return search;
  }
}
