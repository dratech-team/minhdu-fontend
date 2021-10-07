import { select, Store } from '@ngrx/store';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PickEmployeeService {
  employees$ = this.store.pipe(select(selectorAllEmployee));

  constructor(private readonly store: Store) {
  }

  onInit(props?: any) {
    this.store.dispatch(EmployeeAction.loadInit({employee:props}));
  }

  searchEmployees(val: any) {
    this.store.dispatch(EmployeeAction.loadInit({employee:val}));
  }

  Employees() {
    return this.employees$;
  }
}
