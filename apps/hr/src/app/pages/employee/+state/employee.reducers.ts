import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EmployeeAction } from './employee.action';
import { Employee } from './employee.interface';


export interface EmployeeState extends EntityState <Employee> {
  loaded?: boolean;
}

export const adapter = createEntityAdapter<Employee>();

export const initialEmployee = adapter.getInitialState({ loaded: false });
export const employeeReducer = createReducer(
  initialEmployee,
  on(EmployeeAction.LoadEmployeesSuccess, (state, action) =>
    adapter.addMany(action.employees, { ...state, loaded: true })),
  on(EmployeeAction.addEmployeeSuccess, (state, action) =>
    adapter.addOne(action.employee, { ...state, action })),
  on(EmployeeAction.updateEmployeeSuccess, (state, action) =>
    adapter.updateOne(action.employee, { ...state, action })),
  on(EmployeeAction.deleteEmployeeSuccess,(state, action) =>
    adapter.removeOne(action.id, {...state , action})),
);
export const { selectAll } = adapter.getSelectors();
