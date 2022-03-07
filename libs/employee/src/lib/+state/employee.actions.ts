import { Employee } from '@minhdu-fontend/data-models';
import { Predicate } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { EmployeeDto } from './employee.dto';

export const loadInit = createAction(
  '[LOAD_EMPLOYEE] Load Employee',
  props<{ employee: EmployeeDto; isPickEmp?: boolean  }>()
);

export const loadMoreEmployees = createAction(
  '[LOAD_EMPLOYEE] LoadMore Employee',
  props<{ employee: EmployeeDto }>()
);

export const LoadEmployeesSuccess = createAction(
  '[LOAD_EMPLOYEE] Load Employee Success',
  props<{ employees: Employee[]; total: number, }>()
);

const RemoveManyEmployee = createAction(
  '[REMOVE_MANY_EMPLOYEE] Remove many employees',
  props<{ predicate: Predicate<Employee> }>()
);

export const LoadMoreEmployeesSuccess = createAction(
  '[LOAD_EMPLOYEE] LoadMore Employee Success',
  props<{ employees: Employee[]; total: number, }>()
);

export const addEmployee = createAction(
  '[ADD_EMPLOYEE] Add Employee',
  props<{ employee: any }>()
);

export const handleEmployeeError = createAction(
  '[ADD_EMPLOYEE] Add Employee Error'
);

export const addEmployeeSuccess = createAction(
  '[ADD_EMPLOYEE] Add Employee Success',
  props<{ employee: Employee }>()
);

export const addRelative = createAction(
  '[ADD_RELATIVE] Add Relative',
  props<{ relative: any }>()
);
export const handleRelativeError = createAction(
  '[ADD_RELATIVE] Add Relative Error'
);

export const addDegree = createAction(
  '[ADD_DEGREE] Add addDegree',
  props<{ degree: any }>()
);

export const handleDegreeError = createAction('[ADD_DEGREE] Add Degree Error');

export const getEmployee = createAction(
  '[GET EMPLOYEE] Get Employee',
  props<{ id: number }>()
);

export const getEmployeeSuccess = createAction(
  '[GET EMPLOYEE] Get Employee Success',
  props<{ employee: Employee }>()
);

export const updateEmployee = createAction(
  '[UPDATE_EMPLOYEE] Update Employee Employee',
  props<{ id: number; employee: any }>()
);

export const updateEmployeeSuccess = createAction(
  '[UPDATE_EMPLOYEE] Update Success',
  props<{ employee: Employee }>()
);

export const updateRelative = createAction(
  '[UPDATE_RELATIVE] Update Relative',
  props<{ employeeId: number; id: number; relative: any }>()
);

export const updateDegree = createAction(
  '[UPDATE_RELATIVE] Update Degree',
  props<{ id: number; employeeId: number; degree: any }>()
);

export const deleteEmployee = createAction(
  '[DELETE_EMPLOYEE] Delete Employee',
  props<{ id: number }>()
);

export const leaveEmployee = createAction(
  '[LEAVE_EMPLOYEE] Leave Employee',
  props<{ id: number; body: { leftAt: Date | '' } }>()
);

export const deleteEmployeeSuccess = createAction(
  '[DELETE_EMPLOYEE] Delete Employee Success',
  props<{ id: number }>()
);

export const deleteRelative = createAction(
  '[DELETE_RELATIVE] Delete Relative',
  props<{ id: number; employeeId: number }>()
);

export const deleteDegree = createAction(
  '[DELETE_DEGREE] Delete Degree ',
  props<{ id: number; employeeId: number }>()
);

export const setLoaded = createAction(
  '[SET_STATE] Update state loaded ',
  props<{ loaded: boolean }>()
);

export const deleteContract = createAction(
  '[DELETE_CONTRACT] Delete contracts ',
  props<{ id: number; employeeId: number }>()
);

export const deleteContractSuccess = createAction(
  '[DELETE_CONTRACT] Delete contracts Success ',
  props<{ employeeId: number }>()
);

export const updateStateEmployee = createAction(
  '[UPDATE_STATE] Update State Employee  ',
  props<{ scrollX?: number }>()
);

export const deleteWorkHistory = createAction(
  '[DELETE_WORK_HISTORY] Delete Work History ',
  props<{ id: number, employeeId: number }>()
);


export const EmployeeAction = {
  loadMoreEmployees,
  LoadMoreEmployeesSuccess,
  loadInit,
  LoadEmployeesSuccess,
  RemoveManyEmployee,
  addEmployee,
  addEmployeeSuccess,
  handleEmployeeError,
  addRelative,
  handleRelativeError,
  addDegree,
  handleDegreeError,
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
  setLoaded,
  leaveEmployee,
  deleteContract,
  deleteContractSuccess,
  updateStateEmployee,
  deleteWorkHistory,
};
