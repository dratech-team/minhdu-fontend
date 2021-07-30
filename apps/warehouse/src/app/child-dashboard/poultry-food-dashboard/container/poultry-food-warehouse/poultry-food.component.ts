import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectorAllPoultryFood } from '../../+state/poultry-food.selector';
import { PoultryFoodAction } from '../../+state/poultry-food.action';

@Component({
  selector:'app-poultry-food-dashboard',
  templateUrl:'poultry-food.component.html',
})
export class PoultryFoodComponent implements OnInit{
  poultryFoods$ = this.store.pipe(select(selectorAllPoultryFood))
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
