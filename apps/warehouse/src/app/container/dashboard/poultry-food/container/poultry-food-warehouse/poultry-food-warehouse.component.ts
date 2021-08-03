import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllPoultryFood } from '../../+state/poultry-food.selector';
import { PoultryFoodAction } from '../../+state/poultry-food.action';
import { WarehouseTypeEnum } from '@minhdu-fontend/enums';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-poultry-food',
  templateUrl:'poultry-food-warehouse.component.html',
})
export class PoultryFoodWarehouseComponent implements OnInit{
  poultryFoods$ = this.store.pipe(select(selectorAllPoultryFood))
  poultryFoodWarehouse = WarehouseTypeEnum.POULTRY_FOOD
  formGroup = new FormGroup(
    {
      name: new FormControl(''),
    }
  );
  constructor(
    private readonly store: Store
  ) {
  }
  ngOnInit() {
    this.store.dispatch(PoultryFoodAction.loadInit({take:30, skip: 0}))
  }

  importPoultryFood() {
  }
}
