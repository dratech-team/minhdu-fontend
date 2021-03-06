import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaginationDto } from '@minhdu-fontend/constants';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalAlertComponent } from '@minhdu-fontend/components';
import { ModalAlertEntity } from '@minhdu-fontend/base-entity';
import { CommodityTemplateQuery } from '../state/commodity-template.query';
import { CommodityTemplateStore } from '../state/commodity-template.store';
import { CommodityTemplateEntity } from '../entities';
import { CommodityTemplateActions } from '../state/commodity-template.action';
import {
  ModalCommodityTemplateComponent
} from '../components/modal-commodity-template/modal-commodity-template.component';
import { DataModalCommodityTemplateData } from '../data/data-modal-commodity-template.data';
import { ContextMenuEntity } from '@minhdu-fontend/data-models';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { OrderActions } from '../../order/state';
import { debounceTime, startWith } from 'rxjs/operators';
import { AccountQuery } from '../../../../../../../libs/system/src/lib/state/account-management/account.query';
import { ModeEnum } from '@minhdu-fontend/enums';

@Component({
  templateUrl: 'commodity-template.component.html'
})
export class CommodityTemplateComponent implements OnInit {
  account$ = this.accountQuery.selectCurrentUser();
  loading$ = this.query.selectLoading();
  count$ = this.query.selectCount();
  total$ = this.query.select((state) => state.total);
  remain$ = this.query.select(state => state.remain);
  templates$ = this.query.selectAll();

  search = this.query.getValue().search;

  visible = false;
  menus: ContextMenuEntity[] = [
    {
      title: 'Thêm',
      click: () => this.onAdd()
    },
    {
      title: 'Sửa',
      click: (data: CommodityTemplateEntity) => this.onUpdate(data)
    },
    {
      title: 'Xoá',
      click: (data: any) => this.onRemove(data)
    }
  ];

  ModeEnum = ModeEnum;

  formGroup = new FormGroup({
    search: new FormControl<string>('')
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly nzContextMenuService: NzContextMenuService,
    private readonly store: CommodityTemplateStore,
    private readonly query: CommodityTemplateQuery,
    private readonly accountQuery: AccountQuery
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(debounceTime(500), startWith(this.formGroup.value))
      .subscribe((formGroup) => {
        this.actions$.dispatch(
          CommodityTemplateActions.loadAll({
            search: this.mapTemplate(formGroup),
            isSet: true
          })
        );
      });
  }

  onAdd() {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'Tạo dòng gà',
      nzContent: ModalCommodityTemplateComponent,
      nzFooter: []
    });
  }

  onUpdate(template: CommodityTemplateEntity) {
    this.modal.create({
      nzWidth: '35vw',
      nzTitle: 'Cập nhật giống gà',
      nzContent: ModalCommodityTemplateComponent,
      nzComponentParams: <{ data?: DataModalCommodityTemplateData }>{
        data: {
          update: {
            template: template
          }
        }
      },
      nzFooter: []
    });
  }

  onRemove(template: CommodityTemplateEntity) {
    this.modal
      .create({
        nzTitle: `Xoá giống gà ${template.name}`,
        nzContent: ModalAlertComponent,
        nzComponentParams: <{ data: ModalAlertEntity }>{
          data: {
            description: `bạn có chắc chắn muốn xoá giống gà ${template.name} này không?`
          }
        },
        nzFooter: []
      })
      .afterClose.subscribe((val) => {
      if (val) {
        this.actions$.dispatch(
          CommodityTemplateActions.remove({ id: template.id })
        );
      }
    });
  }

  public onLoadMore() {
    this.actions$.dispatch(
      OrderActions.loadAll(this.mapTemplate(this.formGroup.value))
    );
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  private mapTemplate(dataFG: any) {
    return dataFG;
  }
}
