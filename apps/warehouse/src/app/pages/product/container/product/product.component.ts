import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@minhdu-fontend/components';
import { ProductDialogComponent } from '../../components';
import { debounceTime, map } from 'rxjs/operators';
import { PaginationDto, UnitMedicineConstant } from '@minhdu-fontend/constants';
import { ProductActions } from '../../state/product.actions';
import { ProductQuery } from '../../state/product.query';
import { WarehouseAction, WarehouseQuery } from '../../../warehouse/state';
import { InventoryTitleConstants } from '../../constants';
import { Actions } from '@datorama/akita-ng-effects';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductStore } from '../../state/product.store';

@Component({
  selector: 'minhdu-fontend-warehouse',
  templateUrl: 'product.component.html'

})
export class ProductComponent implements OnInit {
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
  medicineConstant = UnitMedicineConstant;
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
    private readonly warehouseQuery: WarehouseQuery,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly modal: NzModalService,
    private readonly productStore: ProductStore
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ProductActions.loadAll({
      params: this.mapProduct(this.formGroup.value, false)
    }));

    this.actions$.dispatch(WarehouseAction.loadAll());

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(ProductActions.loadAll({
            params: this.mapProduct(this.formGroup.value, false)
          }));
        }
      )
    ).subscribe();
  }

  onPagination(index: number) {
    const count = this.productQuery.getCount();
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(ProductActions.loadAll({
        params: this.mapProduct(this.formGroup.value, true),
        isPagination: true
      }));
    }


  }

  onDelete($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.actions$.dispatch(ProductActions.remove({ id: $event.id }));
      }
    });
  }

  onUpdate(Product: any) {
    this.dialog.open(ProductDialogComponent,
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
      nzContent: ProductDialogComponent,
      nzComponentParams: {
        data: {
          wareHouse: this.formGroup.value.wareHouse
        }
      },
      nzFooter: null
    });
  }
}
