import { Injectable } from '@angular/core';
import {EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Employee } from '../models/employee.model';

export type EmployeesState = EntityState<Employee>

@Injectable({ providedIn: 'root'})
@StoreConfig({name: 'employees'})
export class EmployeeStore extends EntityStore<EmployeesState, Employee>{
  constructor() {
    super();
  }
}
