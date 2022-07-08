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
import { OrderActions } from '../../order/+state';
import { startWith } from 'rxjs/operators';

@Component({
  templateUrl: 'commodity-template.component.html'
})
export class CommodityTemplateComponent implements OnInit {
  loading$ = this.query.selectLoading();
  count$ = this.query.selectCount();
  total$ = this.query.select((state) => state.total);
  remain$ = this.query.select(state => state.remain);
  templates$ = this.query.selectAll();

  search = this.query.getValue().search;

  pageSizeTable = 10;
  panelOpenState = false;
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

  formGroup = new FormGroup({
    search: new FormControl<string>('')
  });

  compareFN = (o1: any, o2: any) => (o1 && o2 ? o1.id == o2.id : o1 === o2);

  constructor(
    private readonly query: CommodityTemplateQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly store: CommodityTemplateStore,
    private readonly nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(startWith(''))
      .subscribe((_) => {
        this.actions$.dispatch(
          CommodityTemplateActions.loadAll({
            search: this.mapTemplate(this.formGroup.value, false),
            isPaginate: false
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
      OrderActions.loadAll(this.mapTemplate(this.formGroup.value, true))
    );
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.nzContextMenuService.create($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }

  private mapTemplate(dataFG: any, isPagination: boolean) {
    this.store.update((state) => ({
      ...state,
      search: dataFG
    }));
    return Object.assign({}, dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.query.getCount() : PaginationDto.skip
    });
  }
}
