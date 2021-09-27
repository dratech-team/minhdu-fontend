import { Employee } from '@minhdu-fontend/data-models';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export const EMPLOYEE_FEATURE_KEY = 'employee';

export interface EmployeeState extends EntityState<Employee> {
  loaded: boolean;
  added: boolean
  error: string;
  selectedEmployeeId: number;
}

export const adapter: EntityAdapter<Employee> = createEntityAdapter<Employee>();

export const initialEmployee = adapter.getInitialState({ loaded: false, added: false });

export const EmployeeReducer = createReducer(
  initialEmployee,

  /// FIXME: apply loading tương tự cho các page khác
  on(EmployeeAction.loadInit, (state, _) => {
    return { ...state, loaded: false };
  }),
  on(EmployeeAction.LoadEmployeesSuccess, (state, action) =>
    adapter.setAll(action.employees, { ...state, loaded: true })
  ),
  on(EmployeeAction.LoadMoreEmployeesSuccess, (state, action) =>
    adapter.addMany(action.employees, { ...state, loaded: true })
  ),

  on(EmployeeAction.addEmployee, (state, _) => {
      return { ...state, added: false };
    }
  ),

  on(EmployeeAction.addEmployeeSuccess, (state, action) =>
  {
    return  adapter.addOne(action.employee, { ...state, added: true })
  }

  ),

  on(EmployeeAction.getEmployeeSuccess, (state, action) =>
    adapter.upsertOne(action.employee, { ...state, loaded: true, added: true })
  ),

  on(EmployeeAction.updateEmployee, (state, _) => {
      return { ...state, added: false };
    }
  ),

  on(EmployeeAction.updateEmployeeSuccess, (state, action) =>
  {
    return  adapter.updateOne(action.employee, { ...state, added: true })
  }
  ),

  on(EmployeeAction.deleteEmployeeSuccess, (state, action) =>
    adapter.removeOne(action.id, { ...state, loaded: true })
  )
);

export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
