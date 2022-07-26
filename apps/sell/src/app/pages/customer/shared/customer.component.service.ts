import { Injectable } from '@angular/core';
import { CustomerEntity } from '../entities';
import { CustomerModalComponent, PaymentModalComponent } from '../component';
import { ModalCustomerData } from '../data/modal-customer.data';
import { CustomerActions, CustomerQuery } from '../state';
import { ModalAddOrUpdatePayment } from '../data/modal-payment.data';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { RouterConstants } from '../../../shared/constants';
import { OrderEntity } from '../../order/enitities';

@Injectable()
export class CustomerComponentService {
  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly router: Router,
    private readonly customerQuery: CustomerQuery
  ) {
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Thêm khách hàng',
      nzContent: CustomerModalComponent,
      nzFooter: [],
      nzWidth: '65vw',
      nzMaskClosable: false
    });
  }

  onDetail(customer: CustomerEntity) {
    this.router.navigate([RouterConstants.CUSTOMER.DETAIL, customer.id]).then();
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
    this.modal.create({
      nzTitle: 'Xoá khách hàng',
      nzContent: `Bạn có chắc chắn muốn xoá khách hàng ${customer.lastName} ra khỏi danh sách? Điều này sẽ làm mất đi toàn bộ dữ liệu về khách hàng này, vì vậy bạn hãy cân nhắc trước khi thực hiện nhé!!!`,
      nzOnOk: () => {
        this.actions$.dispatch(CustomerActions.remove({ id: customer.id }));
        this.customerQuery.select().subscribe((state) => {
          if (!state.error && !state.loading) {
            this.router.navigate(['khach-hang']).then();
          }
        });
      }
    });
  }

  onPayment(order?: OrderEntity) {
    return this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Thanh toán',
      nzContent: PaymentModalComponent,
      nzComponentParams: <{ data: ModalAddOrUpdatePayment }>{
        data: {
          add: {
            order: order
          }
        }
      },
      nzFooter: null
    })
  }
}
