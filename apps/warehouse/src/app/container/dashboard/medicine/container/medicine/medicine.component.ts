import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllMedicines } from '../../+state/medicine.selector';
import { MedicineAction } from '../../+state/medicine.action';
import { Router } from '@angular/router';
import { MedicineUnit, MenuEnum, WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Medicine } from '../../+state/medicine.interface';
import { DialogDeleteComponent } from 'libs/components/src/lib/dialog-delete/dialog-delete.component';
import { MedicineDialogComponent } from '../../components/medicine-dialog/medicine-dialog.component';
import { debounceTime, map } from 'rxjs/operators';
import { MainAction } from '../../../../../states/main.action';

@Component({
  selector: 'app-medicine',
  templateUrl: 'medicine.component.html'

})
export class MedicineComponent implements OnInit {
  medicines$ = this.store.pipe(select(selectorAllMedicines));
  medicineWarehouse = WarehouseTypeEnum.MEDICINE;
  medicineUnit = MedicineUnit;
  formGroup = new FormGroup(
    {
      name: new FormControl('')
    }
  );
  pageSize =  30;
  pageIndex = 1;
  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(MainAction.updateStateMenu({tab: MenuEnum.WAREHOUSE_SUPPLIES}))
    this.store.dispatch(MedicineAction.loadInit({ take: 30, skip: 0 }));
    this.formGroup.valueChanges.pipe(
        debounceTime(1000),
        map(value => {
          this.store.dispatch(MedicineAction.loadInit(this.medicine(30, 0, value)));
        }
      )
    ).subscribe();
  }

  importMedicine() {
    this.dialog.open(MedicineDialogComponent, { width: '40%' });
  }

  onScroll() {
    const val = this.formGroup.value
    this.store.dispatch(MedicineAction.loadMoreMedicines(this.medicine(this.pageSize,this.pageIndex,val)))
  }

  medicine(pageSize: number, pageIndex: number, value: any) {
    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      name: value.name
    };
  }

  exportMedicine() {

  }

  deleteMedicine($event: any) {
    const ref = this.dialog.open(DialogDeleteComponent, { width: '30%' });
    ref.afterClosed().subscribe(val => {
      if (val) {
        this.store.dispatch(MedicineAction.deleteMedicine({ medicineId: $event.id }));
      }
    });
  }

  updateMedicine(medicine: Medicine) {
    this.dialog.open(MedicineDialogComponent,
      {
        width: '40%',
        data: medicine
      });
  }
}
