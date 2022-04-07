import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@minhdu-fontend/components';
import { StockDialogComponent } from '../../components';
import { debounceTime, map } from 'rxjs/operators';
import { PaginationDto } from '@minhdu-fontend/constants';
import { StockActions } from '../../state/stock.actions';
import { StockQuery } from '../../state/stock.query';
import { CategoryAction, CategoryQuery } from '../../../category/state';
import { InventoryTitleConstants } from '../../constants';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StockStore } from '../../state/stock.store';
import {CategoryUnitConstant} from "../../../../../shared/constant";

@Component({
  selector: 'minhdu-fontend-category',
  templateUrl: 'stock.component.html'

})
export class StockComponent implements OnInit {
  warehouse$ = this.warehouseQuery.selectAll().pipe(map(warehouses => {
      return warehouses.map(warehouse => ({ value: warehouse.id, name: warehouse.name })).concat({
        value: -1,
        name: 'Tất cả'
      });
    }
  ));
  products$ = this.productQuery.selectAll();
  loading$ = this.productQuery.selectLoading();
  ui$ = this.productQuery.select(state => state.ui);

  stateSearch = this.productQuery.getValue().search;
  medicineConstant = CategoryUnitConstant;
  warehouseIdSelected = this.productQuery.getValue().warehouseIdSelected;
  formGroup = new FormGroup(
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
    private readonly warehouseQuery: CategoryQuery,
    private readonly productQuery: StockQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly productStore: StockStore
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(StockActions.loadAll({
      params: this.mapProduct(this.formGroup.value, false)
    }));

    this.actions$.dispatch(CategoryAction.loadAll());

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(StockActions.loadAll({
            params: this.mapProduct(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.productQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(StockActions.loadAll({
        params: this.mapProduct(this.formGroup.value, true),
        isPagination: true
      }));
    }


  }

  onDelete($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(StockActions.remove({ id: $event.id }));
      }
    });
  }

  onUpdate(Product: any) {
    this.dialog.open(StockDialogComponent,
      {
        width: '40%',
        data: Product
      });
  }

  mapProduct(dataFG: any, isPagination: boolean) {
    this.productStore.update(state => ({
      ...state, search: dataFG
    }));
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.productQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  import() {
    this.modal.create({
      nzTitle: 'Nhập hàng hoá',
      nzContent: StockDialogComponent,
      nzComponentParams: {
        data: {
          wareHouse: this.formGroup.value.wareHouse
        }
      },
      nzFooter: null
    });
  }
}
