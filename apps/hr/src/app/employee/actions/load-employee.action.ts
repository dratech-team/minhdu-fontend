import { createAction, props } from '@ngrx/store';
import { Employee } from '../models/employee.model';


export const loadEmployee =createAction(
  '[LOAD_EMPLOYEE] Load Employee'
)
export  const employeeLoaded = createAction(
  '[LOAD_EMPLOYEE] Load Success',
  props<{employees: Employee[]}>()
);
