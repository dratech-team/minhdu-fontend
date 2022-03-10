import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteComponent} from '@minhdu-fontend/components';
import {ProductDialogComponent} from '../components/product-dialog/product-dialog.component';
import {debounceTime, map} from 'rxjs/operators';
import {PaginationDto, UnitMedicineConstant} from '@minhdu-fontend/constants';
import {Actions} from '@datorama/akita-ng-effects';
import {ProductAction} from '../state/product.action';
import {ProductQuery} from '../state/product.query';
import {WarehouseQuery} from '../../warehouse/state/warehouse.query';
import {WarehouseAction} from '../../warehouse/state/warehouse.action';
import {InventoryTitleConstants} from "../../constants/inventory-title.constant";

@Component({
  selector: 'minhdu-fontend-warehouse',
  templateUrl: 'dashboard.component.html'

})
export class DashboardComponent implements OnInit {
  warehouse$ = this.warehouseQuery.selectAll().pipe(map(warehouses => warehouses.concat({id: -1, name: 'Tất cả'})));
  products$ = this.productQuery.selectAll();
  loading$ = this.productQuery.selectLoading();
  warehouseSelected$ = this.warehouseQuery.select(state => state.selected);

  medicineConstant = UnitMedicineConstant;
  warehouseIdSelected = this.productQuery.getValue().warehouseIdSelected;
  formControlWareHouse = new FormControl(-1)
  formGroup = new FormGroup(
    {
      inventoryType: new FormControl(-1),
      name: new FormControl('')
    }
  );
  panelOpenState = false;
  inventoryTitle = InventoryTitleConstants

  constructor(
    private readonly warehouseQuery: WarehouseQuery,
    private readonly productQuery: ProductQuery,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog,
    private readonly formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.actions$.dispatch(ProductAction.loadProduct({
      search: {
        take: PaginationDto.take,
        skip: PaginationDto.skip,
        warehouseId: this.warehouseIdSelected ? this.warehouseIdSelected : ''
      }
    }));

    this.actions$.dispatch(WarehouseAction.loadWarehouses);

    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
          // this.store.dispatch(MedicineAction.loadInit(this.medicine(30, 0, value)));
        }
      )
    ).subscribe();

    this.formControlWareHouse.valueChanges.subscribe(val => {
      this.actions$.dispatch(WarehouseAction.selectedWarehouseId({warehouseId: val}));
      this.actions$.dispatch(ProductAction.loadProduct({
        search: {
          take: PaginationDto.take,
          skip: PaginationDto.skip,
          warehouseId: val ? val : null
        }
      }));
    })
  }

  importMedicine() {
    this.dialog.open(ProductDialogComponent, {width: '40%'});
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

  import() {
    this.dialog.open(ProductDialogComponent, {
      data: {isUpdate: false}
    }).afterClosed();
  }
}
