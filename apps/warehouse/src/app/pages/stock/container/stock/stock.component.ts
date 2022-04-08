import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {StockDialogComponent} from '../../components';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto} from '@minhdu-fontend/constants';
import {StockActions} from '../../state/stock.actions';
import {StockQuery} from '../../state/stock.query';
import {CategoryAction, CategoryQuery} from '../../../category/state';
import {InventoryTitleConstants} from '../../constants';
import {Actions} from '@datorama/akita-ng-effects';
import {NzModalService} from 'ng-zorro-antd/modal';
import {StockStore} from '../../state/stock.store';
import {StockEntity} from "../../entities";
import {StockEnum} from "../../../../../shared/enums";

@Component({
  selector: 'minhdu-fontend-category',
  templateUrl: 'stock.component.html'

})
export class StockComponent implements OnInit {
  categories$ = this.categoryQuery.selectAll().pipe(map(warehouses => {
      return warehouses.map(warehouse => ({value: warehouse.id, name: warehouse.name})).concat({
        value: -1,
        name: 'Tất cả'
      });
    }
  ));
  products$ = this.stockQuery.selectAll();
  loading$ = this.stockQuery.selectLoading();
  ui$ = this.stockQuery.select(state => state.ui);
  stateSearch = this.stockQuery.getValue().search;
  warehouseIdSelected = this.stockQuery.getValue().warehouseIdSelected;
  stockType = StockEnum
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
    private readonly categoryQuery: CategoryQuery,
    private readonly stockQuery: StockQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly stockStore: StockStore
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
    const count = this.stockQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(StockActions.loadAll({
        params: this.mapProduct(this.formGroup.value, true),
        isPagination: true
      }));
    }


  }

  onDelete($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(StockActions.remove({id: $event.id}));
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
    this.stockStore.update(state => ({
      ...state, search: dataFG
    }));
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.stockQuery.getCount() : PaginationDto.skip
    });
    return dataFG;
  }

  import(stockType: StockEnum, stock?: StockEntity) {
    this.modal.create({
      nzWidth: 'fit-content',
      nzTitle: stockType === StockEnum.IMPORT ? 'Nhập kho' : stockType === StockEnum.EXPORT ? 'Xuất kho' : '',
      nzContent: StockDialogComponent,
      nzComponentParams: {
        data: {
          stock: stock,
          stockType: stockType
        }
      },
      nzFooter: null
    });
  }
}
