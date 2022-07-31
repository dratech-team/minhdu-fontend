import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderDialogComponent } from '../component';
import { SelectCommodityComponent } from '../../../shared/components';
import { OrderActions } from '../state';
import { BaseOrderEntity, OrderEntity } from '../enitities';
import {
  DialogDatePickerComponent
} from '../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { Router } from '@angular/router';
import { RichTextComponent } from '../../../../../../../libs/components/src/lib/rich-text/rich-text.component';

@Injectable()
export class OrderComponentService {
  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly router: Router
  ) {
  }

  onAdd() {
    this.modal.create({
      nzTitle: 'Thêm đơn hàng',
      nzContent: OrderDialogComponent,
      nzWidth: '80vw',
      nzFooter: null
    });
  }

  onDetail(id: number) {
    this.router.navigate(['don-hang/chi-tiet-don-hang', id]).then();
  }

  onUpdate(order: BaseOrderEntity, type?: 'GENERAL' | 'COMMODITY') {
    if (type === 'GENERAL') {
      this.modal.create({
        nzTitle: 'Sửa đơn hàng',
        nzContent: OrderDialogComponent,
        nzComponentParams: {
          data: { order: order, tab: 0, isUpdate: true }
        },
        nzWidth: '65vw',
        nzMaskClosable: false,
        nzFooter: []
      });
    } else {
      this.modal.create({
        nzTitle: 'Chọn hàng hoá',
        nzContent: SelectCommodityComponent,
        nzComponentParams: { data: { commodities: order.commodities, isUpdate: true } },
        nzWidth: '70vw',
        nzFooter: []
      }).afterClose.subscribe((commodityIds: number[]) => {
        if (commodityIds?.length) {
          this.actions$.dispatch(
            OrderActions.update({
              id: order.id,
              updates: {
                commodityIds: commodityIds
              }
            })
          );
        }
      });
    }
  }

  onRemove(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Xoá đơn hàng',
      nzContent: `Bạn có chắc chắn muốn xoá đơn hàng này vĩnh viễn`,
      nzOnOk: () => {
        this.actions$.dispatch(OrderActions.remove({ id: order.id }));
      }
    });
  }

  onRestore(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Bạn có chắc chắn muốn khôi phục đơn hàng?',
      nzContent: `Sau khi khôi phục đơn hàng của khách hàng ${order.customer.lastName}. Mọi thao tác trên đơn hàng này sẽ được khôi phục..!!`,
      nzOnOk: () => {
        this.actions$.dispatch(OrderActions.restore({ id: order.id }));
      }
    });
  }

  onCancel(order: OrderEntity) {
    this.modal.warning({
      nzTitle: 'Huỷ đơn hàng',
      nzContent: RichTextComponent,
      nzComponentParams: { description: `Bạn có chắc chắn muốn huỷ đơn hàng đến ${order.province.name} của khách hàng ${order.customer.lastName} không? \n Nếu có thể hãy cho chúng tôi biết lý do ở bên dưới nhé` },
      nzOkDanger: true,
      nzOnOk: (res) => {
        this.actions$.dispatch(
          OrderActions.cancel({ id: order.id, reason: res.formGroup.value.reason || undefined })
        );
      }
    });
  }

  onDelivery(order: OrderEntity) {
    this.modal.create({
      nzTitle: 'Xác nhận ngày giao hàng',
      nzContent: DialogDatePickerComponent,
      nzMaskClosable: false,
      nzComponentParams: { datetime: new Date() },
      nzFooter: []
    }).afterClose.subscribe((res: { date: Date }) => {
      if (res) {
        this.actions$.dispatch(
          OrderActions.update({
            id: order.id,
            updates: {
              deliveredAt: res.date
            }
          })
        );
      }
    });
  }
}
