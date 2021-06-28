import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EmployeeAction } from './employee.action';
import { Employee } from '../../../../data-models/employee/employee';

export const EMPLOYEE_FEATURE_KEY = 'employee';

export interface EmployeeState extends EntityState <Employee> {
  loaded: boolean,
  selectedEmployeeId: number
}

export const adapter: EntityAdapter<Employee> = createEntityAdapter<Employee>();

export const initialEmployee = adapter.getInitialState({ loaded: false });

export const employeeReducer = createReducer(
  initialEmployee,
  on(EmployeeAction.LoadEmployeesSuccess, (state, action) =>
    adapter.addMany(action.employees, { ...state, loaded: true })),

  on(EmployeeAction.addEmployeeSuccess, (state, action) =>
    adapter.addOne(action.employee, { ...state, loaded: true })),

  on(EmployeeAction.getEmployeeSuccess, (state, action) =>
    adapter.upsertOne(action.employee , { ...state, loaded: true })),

  on(EmployeeAction.updateEmployeeSuccess, (state, action) =>
    adapter.updateOne( action.employee, { ...state, loaded: true })),

  on(EmployeeAction.deleteEmployeeSuccess, (state, action) =>
    adapter.removeOne(action.id, { ...state, loaded: true })),
  );

export const {
  selectEntities,
  selectAll
} = adapter.getSelectors();

