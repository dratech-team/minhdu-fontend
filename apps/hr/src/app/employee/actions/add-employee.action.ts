import { createAction, props } from '@ngrx/store';
import { Employee } from '../models/employee.model';

export const addEmployee =createAction(
  '[ADD_EMPLOYEE] Add Employee',
  props<{employee: Employee}>()
)
export const employeeAdded = createAction(
  '[ADD_EMPLOYEE] Add Success',
)
