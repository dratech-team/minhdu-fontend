import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {IoiReceiptActions} from '../../state/ioi-receipt.actions';
import {IoiReceiptQuery} from '../../state/ioi-receipt.query';
import {InventoryTitleConstants} from '../../constants';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {IoiReceiptStore} from '../../state/ioi-receipt.store';
import {IoiReceiptEntity} from "../../entities";
import {IoiReceiptEnum} from "../../../../../shared/enums";
import { WarehouseAction, WarehouseQuery } from '../../../warehouse/state';
import {IoiReceiptDialogComponent} from "../../components";

@Component({
  selector: 'minhdu-fontend-category',
  templateUrl: 'ioi-receipt.component.html'

})
export class IoiPtreceiComponent implements OnInit {
  categories$ = this.categoryQuery.selectAll().pipe(map(warehouses => {
      return warehouses.map(warehouse => ({value: warehouse.id, name: warehouse.name})).concat({
        value: -1,
        name: 'Tất cả'
      });
    }
  ));
  products$ = this.ioiReceiptQuery.selectAll();
  loading$ = this.ioiReceiptQuery.selectLoading();
  ui$ = this.ioiReceiptQuery.select(state => state.ui);
  stateSearch = this.ioiReceiptQuery.getValue().search;
  warehouseIdSelected = this.ioiReceiptQuery.getValue().warehouseIdSelected;
  stockType = IoiReceiptEnum
  formGroup = new FormGroup(
    // check annonate ng đặt fixme là Long nhưng ko chú thích nên không biết vấn đề cần fix là gì
    /// FIXME:
    {
      // inventoryType: new FormControl(this.stateSearch.inventoryType),
      // search: new FormControl(this.stateSearch.search),
      // warehouseType: new FormControl(this.stateSearch.warehouseType)
    }
  );
  panelOpenState = false;
  inventoryTitle = InventoryTitleConstants;
  pageSizeTable = 10;
  visible = false;

  constructor(
    private readonly categoryQuery: WarehouseQuery,
    private readonly ioiReceiptQuery: IoiReceiptQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly ioiReceiptStore: IoiReceiptStore
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(IoiReceiptActions.loadAll({
      params: this.mapProduct(this.formGroup.value, false)
    }));

    this.actions$.dispatch(WarehouseAction.loadAll());

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(_ => {
          this.actions$.dispatch(IoiReceiptActions.loadAll({
            params: this.mapProduct(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.ioiReceiptQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(IoiReceiptActions.loadAll({
        params: this.mapProduct(this.formGroup.value, true),
        isPagination: true
      }));
    }


  }

  onDelete($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(IoiReceiptActions.remove({id: $event.id}));
      }
    });
  }

  onUpdate(Product: any) {
    this.dialog.open(IoiReceiptDialogComponent,
      {
        width: '40%',
        data: Product
      });
  }

  mapProduct(dataFG: any, isPagination: boolean) {
    this.ioiReceiptStore.update(state => ({
      ...state, search: dataFG
    }));
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.ioiReceiptQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  import(ioiReceipt: IoiReceiptEnum, ioiReceiptEntity?: IoiReceiptEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: ioiReceipt === IoiReceiptEnum.GOODS_RECEIPT ? 'Nhập kho' : ioiReceipt === IoiReceiptEnum.GOODS_ISSUE ? 'Xuất kho' : '',
      nzContent: IoiReceiptDialogComponent,
      nzComponentParams: {
        data: {
          ioiReceipt: ioiReceiptEntity,
          ioiReceiptType: ioiReceipt
        }
      },
      nzFooter: null
    });
  }
}
