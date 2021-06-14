import { Employee } from '../models/employee.model';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { EmployeeActions } from '../actions';

export  interface EmployeeState extends EntityState <Employee>{
  loaded: boolean;
}

export const adapter = createEntityAdapter<Employee>()

export const initialEmployee = adapter.getInitialState({loaded: false});

export  const  employeeReducer = createReducer(
  initialEmployee,
  on(EmployeeActions.employeeLoaded, (state, action) =>
  adapter.addMany(action.employees,{...state, loaded: true}))
)
export const { selectAll } = adapter.getSelectors();
