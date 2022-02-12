import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@minhdu-fontend/components';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';
import { debounceTime, map } from 'rxjs/operators';
import { PaginationDto, UnitMedicineConstant } from '@minhdu-fontend/constants';
import { WarehouseAction } from '../../../../../pages/warehouse/state/warehouse.action';
import { WarehouseQuery } from '../../../../../pages/warehouse/state/warehouse.query';
import { Actions } from '@datorama/akita-ng-effects';
import { ProductAction } from '../../state/product.action';
import { ProductQuery } from '../../state/product.query';
import { Warehouse } from '../../../../../pages/warehouse/state/entities/product.entity';

@Component({
  selector: 'minhdu-fontend-warehouse',
  templateUrl: 'medicine.component.html'

})
export class MedicineComponent implements OnInit {
  warehouse$ = this.warehouseQuery.selectAll().pipe(map(warehouses => warehouses.concat({ id: -1, name: 'Tất cả' })));
  products$ = this.productQuery.selectAll();
  loading$ = this.productQuery.selectLoading();

  medicineConstant = UnitMedicineConstant;
  warehouseIdSelected = this.productQuery.getValue().warehouseIdSelected;
  formGroup = new FormGroup(
    {
      name: new FormControl('')
    }
  );

  constructor(
    private readonly warehouseQuery: WarehouseQuery,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ProductAction.loadProduct({
      take: PaginationDto.take,
      skip: PaginationDto.skip,
      warehouseId: this.warehouseIdSelected
    }));

    this.actions$.dispatch(WarehouseAction.loadWarehouses);

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          // this.store.dispatch(MedicineAction.loadInit(this.medicine(30, 0, value)));
        }
      )
    ).subscribe();
  }

  importMedicine() {
    this.dialog.open(ProductDialogComponent, { width: '40%' });
  }

  onScroll() {
    const val = this.formGroup.value;
    // this.store.dispatch(MedicineAction.loadMoreMedicines(this.medicine(this.pageSize,this.pageIndex,val)))
  }

  medicine(pageSize: number, pageIndex: number, value: any) {
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      name: value.name
    };
  }

  deleteMedicine($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
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

  selectWarehouse(warehouse: Warehouse) {
    this.actions$.dispatch(WarehouseAction.selectedWarehouseId({ warehouseId: warehouse.id }));
    this.actions$.dispatch(ProductAction.loadProduct({
      take: PaginationDto.take,
      skip: PaginationDto.skip,
      warehouseId: warehouse.id > 0 ? warehouse.id : null
    }));
  }


  import() {
    this.dialog.open(ProductDialogComponent, {
      data: { isUpdate: false }
    });
  }
}
