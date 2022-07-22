import { Injectable } from '@angular/core';
import { RouteEntity } from '../entities';
import { RouteDialogComponent } from '../component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdaterRouteTypeEnum } from '../enums';
import { RouteActions, RouteQuery } from '../state';
import { Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import { ModalDatePickerComponent } from '@minhdu-fontend/components';
import { ModalDatePickerEntity } from '@minhdu-fontend/base-entity';
import {
  DialogDatePickerComponent
} from '../../../../../../../libs/components/src/lib/dialog-datepicker/dialog-datepicker.component';
import { RouterConstants } from '../../../shared/constants';

@Injectable()
export class RouteComponentService {
  constructor(
    private readonly actions$: Actions,
    private readonly modal: NzModalService,
    private readonly router: Router,
    private readonly routeQuery: RouteQuery
  ) {
  }

  onAdd() {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzFooter: []
    });
  }

  onDetail(id: number) {
    this.router.navigate([RouterConstants.ROUTE.DETAIL, id]).then();
  }

  onUpdate(route: RouteEntity, updateType: UpdaterRouteTypeEnum) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: 'Cập nhật tuyến đường',
      nzContent: RouteDialogComponent,
      nzComponentParams: <{ data?: any }>{
        data: { route: route, updateType: updateType, isUpdate: true }
      },
      nzFooter: []
    });
  }

  onRemove(route: RouteEntity) {
    this.modal.warning({
      nzTitle: 'Xoá tuyến đương',
      nzContent: `Bạn có chắc chắn muốn huỷ tuyến đường ${route.name} này không`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.actions$.dispatch(RouteActions.remove({ idRoute: route.id }));
        this.routeQuery
          .select((state) => state.deleted)
          .subscribe((val) => {
            if (val) {
              this.router.navigate(['tuyen-duong']).then();
            }
          });
      }
    });
  }

  onComplete(route: RouteEntity) {
    this.modal.create({
      nzTitle: 'Hoàn tất tuyến đường',
      nzContent: ModalDatePickerComponent,
      nzComponentParams: <{ data: ModalDatePickerEntity }>{
        data: {
          type: 'date',
          dateInit: route.endedAt
        }
      },
      nzFooter: []
    })
      .afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(
          RouteActions.update({
            updates: { endedAt: new Date(val) },
            id: route.id
          })
        );
      }
    });
  }

  onEnd(route: RouteEntity) {
    this.modal.create({
      nzTitle: 'Xác nhận giao hàng',
      nzContent: DialogDatePickerComponent,
      nzMaskClosable: false,
      nzFooter: []
    }).afterClose.subscribe((res: { date: Date }) => {
      if (res) {
        this.actions$.dispatch(
          RouteActions.update({ id: route.id, updates: { endedAt: res.date } })
        );
      }
    });
  }
}
