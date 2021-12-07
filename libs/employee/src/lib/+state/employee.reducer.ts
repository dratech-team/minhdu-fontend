import { Employee } from '@minhdu-fontend/data-models';
import { EmployeeAction } from '@minhdu-fontend/employee';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export const EMPLOYEE_FEATURE_KEY = 'employee';

export interface EmployeeState extends EntityState<Employee> {
  loaded: boolean;
  adding: boolean;
  added: boolean;
  error: string;
  deleted: boolean;
  branch: string;
  position: string
  selectedEmployeeId: number;
  scrollX: number,
  total: number
}

export const adapter: EntityAdapter<Employee> = createEntityAdapter<Employee>();

export const initialEmployee = adapter.getInitialState({
  loaded: false,
  adding: false,
  added: false,
  deleted: false,
  position: '',
  branch: '',
  scrollX: 0,
  total: 0
});

export const EmployeeReducer = createReducer(
  initialEmployee,

  on(EmployeeAction.loadInit, (state, _) => {
    return { ...state, loaded: false };
  }),
  on(EmployeeAction.LoadEmployeesSuccess, (state, action) =>
    adapter.setAll(action.employees, { ...state, loaded: true, total: action.total })
  ),
  on(EmployeeAction.LoadMoreEmployeesSuccess, (state, action) =>
    adapter.addMany(action.employees, { ...state, loaded: true, total: action.total })
  ),

  on(EmployeeAction.addEmployee, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),

  on(EmployeeAction.addEmployeeSuccess, (state, action) => {
      return adapter.addOne(action.employee, { ...state, adding: false, added: true, total: state.total + 1 });
    }
  ),

  on(EmployeeAction.handleEmployeeError, (state, _) => {
      return { ...state, adding: false };
    }
  ),

  on(EmployeeAction.getEmployeeSuccess, (state, action) =>
    adapter.upsertOne(action.employee, { ...state, loaded: true, adding: false, added: true })
  ),

  on(EmployeeAction.updateEmployee, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),

  on(EmployeeAction.updateEmployeeSuccess, (state, { employee }) => {
      console.log(employee);
      return adapter.updateOne(
        { id: employee.id, changes: employee },
        { ...state, adding: false, added: true });
    }
  ),

  on(EmployeeAction.deleteEmployee, (state, _) => {
      return { ...state, deleted: false };
    }
  ),

  on(EmployeeAction.leaveEmployee, (state, _) => {
      return { ...state, deleted: false };
    }
  ),

  on(EmployeeAction.deleteEmployeeSuccess, (state, action) =>
    adapter.removeOne(action.id, { ...state, loaded: true, deleted: true, total: state.total - 1 })
  ),

  on(EmployeeAction.deleteContractSuccess, (state, { employeeId }) =>
    adapter.updateOne({
        id: employeeId,
        changes: {
          contracts: []
        }
      },
      { ...state, loaded: true, deleted: true })
  ),

  on(EmployeeAction.addRelative, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),

  on(EmployeeAction.handleRelativeError, (state, _) => {
      return { ...state, adding: false };
    }
  ),

  on(EmployeeAction.updateRelative, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),

  on(EmployeeAction.addDegree, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),

  on(EmployeeAction.handleDegreeError, (state, _) => {
      return { ...state, adding: false };
    }
  ),

  on(EmployeeAction.updateDegree, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),

  on(EmployeeAction.updateStateEmployee, (state, { scrollX }) => {
    return { ...state, scrollX: scrollX ? scrollX : state.scrollX };
  })
);


export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
