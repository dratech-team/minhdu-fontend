import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllPoultryFood } from '../../+state/poultry-food.selector';
import { PoultryFoodAction } from '../../+state/poultry-food.action';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogComponent } from '../../../material/components/material-dialog/material-dialog.component';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-poultry-food',
  templateUrl: 'poultry-food-warehouse.component.html'
})
export class PoultryFoodWarehouseComponent implements OnInit {
  poultryFoods$ = this.store.pipe(select(selectorAllPoultryFood));
  poultryFoodWarehouse = WarehouseTypeEnum.POULTRY_FOOD;
  formGroup = new FormGroup(
    {
      name: new FormControl('')
    }
  );
  pageSize = 30;
  pageIndex = 1;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(PoultryFoodAction.loadInit({ take: 30, skip: 0 }));
    this.formGroup.valueChanges.pipe(
      debounceTime(1000),
      map(value => {
        this.store.dispatch(PoultryFoodAction.loadInit(this.poultryFood(30, 0, value)));
      })
    ).subscribe();
  }

  poultryFood(pageSize: number, pageIndex: number, val: any) {

    return {
      take: pageSize,
      skip: pageSize * pageIndex++,
      name: val.name
    };
  }

  importPoultryFood() {
    this.dialog.open(MaterialDialogComponent, { width: '40%' });
  }

  updatePoultryFood($event: any) {
    this.dialog.open(MaterialDialogComponent, {
      width: '40%',
      data: $event
    });
  }

  onScroll() {
    const val = this.formGroup.value;
    this.store.dispatch(PoultryFoodAction.loadMorePoultryFoods(
      this.poultryFood(this.pageSize, this.pageIndex, val)));
  }
}
