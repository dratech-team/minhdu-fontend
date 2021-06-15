import { createAction, props } from '@ngrx/store';
import { Employee } from '../models/employee.model';
import { Update } from '@ngrx/entity/src/models';


export const loadEmployees = createAction(
  '[LOAD_EMPLOYEE] Load Employee'
)
export  const LoadEmployeesSuccess = createAction(
  '[LOAD_EMPLOYEE] Load Employee Success',
  props<{employees: Employee[]}>()
);

export  const addEmployee = createAction(
  '[ADD_EMPLOYEE] Add Employee',
  props<{ employee: Employee|undefined }>()
)
export const addEmployeeSuccess = createAction(
  '[ADD_EMPLOYEE] Add Employee Success',
  props<{employee: Employee}>()
)

export  const updateEmployee = createAction(
  '[UPDATE_EMPLOYEE] Update Employee Employee',
  props<{ id:number, employee: Employee}>()
)
export const updateEmployeeSuccess = createAction(
  '[UPDATE_EMPLOYEE] Update Success',
  props<{ employee: Employee}>()
)

export const  deleteEmployee = createAction(
  '[DELETE_EMPLOYEE] Delete Employee',
  props<{ id : number}>()
)
export const  deleteEmployeeSuccess = createAction(
  '[DELETE_EMPLOYEE] Delete Employee Success',
)
