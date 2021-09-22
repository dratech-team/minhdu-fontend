import { select, Store } from '@ngrx/store';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { Employee } from '@minhdu-fontend/data-models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PickEmployeeService {
  employees$ = this.store.pipe(select(selectorAllEmployee));

  constructor(private readonly store: Store) {
  }

  onInit(props?: any) {
    this.store.dispatch(EmployeeAction.loadInit(props));
  }

  scrollEmployee(val: any) {
    this.store.dispatch(EmployeeAction.loadMoreEmployees(val));
  }

  searchEmployees(val: any) {
    this.store.dispatch(EmployeeAction.loadInit(val));
  }

  Employees() {
    return this.employees$;
  }
}
