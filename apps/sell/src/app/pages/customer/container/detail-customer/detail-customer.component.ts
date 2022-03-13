import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {DevelopmentComponent, DialogDeleteComponent} from '@minhdu-fontend/components';
import {ConvertBoolean, MenuEnum, PaidType} from '@minhdu-fontend/enums';
import {CustomerActions} from '../../+state/customer.actions';
import {CustomerEntity} from '../../entities/customer.entity';
import {OrderEntity} from '../../../order/enitities/order.interface';
import {CustomerDialogComponent} from '../../component/customer-dialog/customer-dialog.component';
import {PaymentDialogComponent} from '../../component/payment-dialog/payment-dialog.component';
import {CustomerQuery} from '../../+state/customer.query';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  templateUrl: 'detail-customer.component.html',
  styleUrls: ['detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {
  customer$ = this.customerQuery.selectEntity(this.getId);
  delivered$ = this.customerQuery.selectDelivered(this.getId);
  delivering$ = this.customerQuery.selectDelivering(this.getId);
  deliveringLoading$ = this.customerQuery.select(state => state.deliveringLoading);
  deliveredLoading$ = this.customerQuery.select(state => state.deliveredLoading);

  convertBoolean = ConvertBoolean;
  paidType = PaidType;
  orders: OrderEntity[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly actions$: Actions,
    private readonly customerQuery: CustomerQuery,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly viewContentRef: ViewContainerRef
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(CustomerActions.loadOne({id: this.getId}));
    this.actions$.dispatch(CustomerActions.loadOrderDelivered({take: 20, skip: 0, customerId: +this.getId}));
    this.actions$.dispatch(CustomerActions.loadOrderDelivering({take: 20, skip: 0, customerId: +this.getId}));

    this.activatedRoute.queryParams.subscribe(param => {
      if (param.isUpdate === 'true') {
        const customer = this.customerQuery.getEntity(this.getId);
        if (this.getId && customer) {
          this.updateCustomer(customer);
        }
      }
    });
  }

  updateCustomer(customer: CustomerEntity) {
    this.modal.create({
      nzTitle: 'Sửa khách hàng',
      nzContent: CustomerDialogComponent,
      nzViewContainerRef: this.viewContentRef,
      nzComponentParams: {
        data: {customer, isUpdate: true}
      },
      nzFooter: null,
      nzWidth: '65vw',
      nzMaskClosable: false
    });

  }

  get getId(): number {
    return this.activatedRoute.snapshot.params.id;
  }

  deleteCustomer(id: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '25%'
    });
    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.actions$.dispatch(CustomerActions.remove({id: id}));
      }
    });
  }

  payment(id: number) {
    this.dialog.open(PaymentDialogComponent, {
      width: 'fit-content',
      data: {id: id}
    });
  }

  development() {
    this.dialog.open(DevelopmentComponent, {width: '25%'});
  }
}
