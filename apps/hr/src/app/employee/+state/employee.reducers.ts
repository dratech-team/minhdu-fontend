import { Employee } from '../models/employee.model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EmployeeAction } from './employee.action';



export interface EmployeeState extends EntityState <Employee> {
  loaded?: boolean;
}
export const adapter = createEntityAdapter<Employee>();

export const initialEmployee = adapter.getInitialState({ loaded: false });
export const employeeReducer = createReducer(
  initialEmployee,
  on(EmployeeAction.LoadEmployeesSuccess, (state, action) =>
    adapter.setAll(action.employee, { ...state, loaded: true })),
  on(EmployeeAction.addEmployeeSuccess, (state, action) =>
    adapter.addOne(action.employee ,{...state, action})),
  on(EmployeeAction.updateEmployee, (state, action)=>
    adapter.upsertOne(action.employee, {...state, action})),
  on(EmployeeAction.deleteEmployee, (state, action)=>
    adapter.removeOne( action.id ,{...state, action})),
)
export const { selectAll } = adapter.getSelectors();
