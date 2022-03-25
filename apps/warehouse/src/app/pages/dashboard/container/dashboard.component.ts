import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {ProductDialogComponent} from '../components/product-dialog/product-dialog.component';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto, UnitMedicineConstant} from '@minhdu-fontend/constants';
import {Actions} from '@datorama/akita-ng-effects';
import {ProductActions} from '../state/productActions';
import {ProductQuery} from '../state/product.query';
import {WarehouseQuery} from '../../warehouse/state/warehouse.query';
import {WarehouseAction} from '../../warehouse/state/warehouse.action';
import {InventoryTitleConstants} from "../constants/inventory-title.constant";

@Component({
  selector: 'minhdu-fontend-warehouse',
  templateUrl: 'dashboard.component.html'

})
export class DashboardComponent implements OnInit {
  warehouse$ = this.warehouseQuery.selectAll().pipe(map(warehouses => {
      const convertWarehouseType: { value: number, name: string }[] = [{value: -1, name: 'Tất cả'}]
      warehouses.forEach(warehouse => {
        convertWarehouseType.push({value: warehouse.id, name: warehouse.name});
      })
      return convertWarehouseType
    }
  ));
  products$ = this.productQuery.selectAll();
  loading$ = this.productQuery.selectLoading();
  warehouseSelected$ = this.warehouseQuery.select(state => state.selected);
  medicineConstant = UnitMedicineConstant;
  warehouseIdSelected = this.productQuery.getValue().warehouseIdSelected;
  formGroup = new FormGroup(
    {
      inventoryType: new FormControl(-1),
      search: new FormControl(''),
      warehouseType: new FormControl(-1)
    }
  );
  panelOpenState = false;
  inventoryTitle = InventoryTitleConstants
  pageSizeTable = 10;

  constructor(
    private readonly warehouseQuery: WarehouseQuery,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ProductActions.loadAll(this.mapProduct(this.formGroup.value, false)));

    this.actions$.dispatch(WarehouseAction.loadWarehouses);

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          this.actions$.dispatch(ProductActions.loadAll(this.mapProduct(this.formGroup.value, false)))
        }
      )
    ).subscribe();
  }

  importMedicine() {
    this.dialog.open(ProductDialogComponent, {width: '40%'});
  }

  onPagination(index: number) {
    const count = this.productQuery.getCount()
    if (index * this.pageSizeTable >= count) {
      this.actions$.dispatch(ProductActions.loadAll(this.mapProduct(this.formGroup.value, true)))
    }


  }

  deleteMedicine($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, {width: '30%'});
    ref.afterClosed().subscribe(val => {
      if (val) {
      }
    });
  }

  updateMedicine(medicine: any) {
    this.dialog.open(ProductDialogComponent,
      {
        width: '40%',
        data: medicine
      });
  }

  mapProduct(dataFG: any, isPagination: boolean) {
    Object.assign(dataFG, {
      take: PaginationDto.take,
      skip: isPagination ? this.productQuery.getCount() : PaginationDto.skip
    })
    return dataFG
  }

  import() {
    this.dialog.open(ProductDialogComponent, {
      data: {isUpdate: false}
    }).afterClosed();
  }
}
