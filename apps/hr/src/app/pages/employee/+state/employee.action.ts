import { createAction, props } from '@ngrx/store';
import { RequestPaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';
import { Employee } from './employee.interface';

export const loadEmployees = createAction(
  '[LOAD_EMPLOYEE] Load Employee',
  props<RequestPaginate>()
);
export const LoadEmployeesSuccess = createAction(
  '[LOAD_EMPLOYEE] Load Employee Success',
  props<{ employees: Employee[] }>()
);

export const addEmployee = createAction(
  '[ADD_EMPLOYEE] Add Employee',
  props<{ employee: any }>()
);
export const addEmployeeSuccess = createAction(
  '[ADD_EMPLOYEE] Add Employee Success',
  props<{ employee: Employee,}>()
);

export const addRelative = createAction(
  '[ADD_RELATIVE] Add Relative',
  props<{ relative: any }>()
);
export const addDegree = createAction(
  '[ADD_DEGREE] Add addDegree',
  props<{ degree: any }>()
);

export const getEmployee = createAction(
  '[GET EMPLOYEE] Get Employee',
  props<{ id: number}>()
);
export const getEmployeeSuccess = createAction(
  '[GET EMPLOYEE] Get Employee Success',
  props<{employee: Employee}>()
);

export const updateEmployee = createAction(
  '[UPDATE_EMPLOYEE] Update Employee Employee',
  props<{ id: number, employee: any }>()
);
export const updateEmployeeSuccess = createAction(
  '[UPDATE_EMPLOYEE] Update Success',
  props<{ employee: Update<Employee>}>()
);

export const updateRelative = createAction(
  '[UPDATE_RELATIVE] Update Relative',
  props<{employeeId:number, id: number,relative: any }>()
);

export const updateDegree = createAction(
  '[UPDATE_RELATIVE] Update Degree',
  props<{id: number, employeeId:number, degree: any }>()
);

export const deleteEmployee = createAction(
  '[DELETE_EMPLOYEE] Delete Employee',
  props<{ id: number }>()
);
export const deleteEmployeeSuccess = createAction(
  '[DELETE_EMPLOYEE] Delete Employee Success',
  props<{id: number}>()
);
export const deleteRelative = createAction(
  '[DELETE_RELATIVE] Delete Relative',
  props<{ id: number, employeeId: number }>()
);

export const deleteDegree = createAction(
  '[DELETE_DEGREE] Delete Degree ',
  props<{ id: number,employeeId: number }>()
);



export const EmployeeAction = {
  loadEmployees,
  LoadEmployeesSuccess,
  addEmployee,
  addEmployeeSuccess,
  addRelative,
  addDegree,
  getEmployee,
  getEmployeeSuccess,
  updateEmployee,
  updateEmployeeSuccess,
  updateRelative,
  updateDegree,
  deleteEmployee,
  deleteEmployeeSuccess,
  deleteRelative,
  deleteDegree,
};
