import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@minhdu-fontend/components';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';
import { debounceTime, map } from 'rxjs/operators';
import { PaginationDto, UnitMedicineConstant } from '@minhdu-fontend/constants';
import { selectProducts, selectWarehouseLoading } from '../../state/warehouse/warehouse.selector';
import { DashboardService } from '../../../../../pages/dashboard/dashboard.service';
import { WarehouseAction } from '../../state/warehouse/warehouse.action';
import { Warehouse } from '../../state/warehouse/entities/product.entity';

@Component({
  selector: 'minhdu-fontend-warehouse',
  templateUrl: 'medicine.component.html'

})
export class MedicineComponent implements OnInit {
  warehouse$ = this.service.getAll();
  products$ = this.store.select(selectProducts);
  loading$ = this.store.select(selectWarehouseLoading);

  medicineConstant = UnitMedicineConstant;
  formGroup = new FormGroup(
    {
      name: new FormControl('')
    }
  );

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly service: DashboardService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(WarehouseAction.loadProduct({
      take: PaginationDto.take,
      skip: PaginationDto.skip,
      warehouseId: 1
    }));

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

  selectWarehouse(warehouse: any) {
    console.log(warehouse);
    this.store.dispatch(WarehouseAction.selectWarehouse({ warehouseId: warehouse.id }));
  }


  import() {
    this.dialog.open(ProductDialogComponent);
  }
}
