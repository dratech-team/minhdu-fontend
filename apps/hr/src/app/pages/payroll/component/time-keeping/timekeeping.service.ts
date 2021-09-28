import { select, Store } from '@ngrx/store';
import { EmployeeAction, selectorAllEmployee } from '@minhdu-fontend/employee';
import { Employee } from '@minhdu-fontend/data-models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimekeepingService {
  constructor(private readonly store: Store) {
  }

  onInit(props?: any) {
    this.store.dispatch(EmployeeAction.loadInit(props));
  }

  searchEmployees(val: any) {
    this.store.dispatch(EmployeeAction.loadInit(val));
  }
}
