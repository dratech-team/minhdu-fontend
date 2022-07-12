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
  position: string;
  selectedEmployeeId: number;
  scrollX: number;
  total: number;
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
  total: 0,
});

export const EmployeeReducer = createReducer(
  initialEmployee,

  on(EmployeeAction.loadInit, (state, action) => {
    return { ...state, loaded: action?.isPickEmp ? state.loaded : false };
  }),
  on(EmployeeAction.LoadEmployeesSuccess, (state, { employees, total }) => {
    return adapter.setAll(employees, {
      ...state,
      loaded: true,
      total: total,
    });
  }),

  on(EmployeeAction.RemoveManyEmployee, (state, { predicate }) => {
    return adapter.removeMany(predicate, state);
  }),

  on(EmployeeAction.LoadMoreEmployeesSuccess, (state, action) =>
    adapter.addMany(action.employees, {
      ...state,
      loaded: true,
      total: action.total,
    })
  ),
  on(EmployeeAction.addEmployee, (state) => {
    return { ...state, adding: true, added: false };
  }),

  on(EmployeeAction.addEmployeeSuccess, (state, action) => {
    return adapter.addOne(action.employee, {
      ...state,
      adding: false,
      added: true,
      total: state.total + 1,
    });
  }),

  on(EmployeeAction.handleEmployeeError, (state) => {
    return { ...state, adding: false };
  }),

  on(EmployeeAction.getEmployeeSuccess, (state, action) =>
    adapter.upsertOne(action.employee, {
      ...state,
      loaded: true,
      adding: false,
      added: true,
    })
  ),

  on(EmployeeAction.updateEmployee, (state) => {
    return { ...state, adding: true, added: false };
  }),

  on(EmployeeAction.updateEmployeeSuccess, (state, { employee }) => {
    return adapter.updateOne(
      { id: employee.id, changes: employee },
      { ...state, adding: false, added: true }
    );
  }),

  on(EmployeeAction.deleteEmployee, (state) => {
    return { ...state, deleted: false };
  }),

  on(EmployeeAction.leaveEmployee, (state) => {
    return { ...state, deleted: false };
  }),

  on(EmployeeAction.deleteEmployeeSuccess, (state, action) =>
    adapter.removeOne(action.id, {
      ...state,
      loaded: true,
      deleted: true,
      total: state.total - 1,
    })
  ),

  on(EmployeeAction.deleteContractSuccess, (state, { employeeId }) =>
    adapter.updateOne(
      {
        id: employeeId,
        changes: {
          contracts: [],
        },
      },
      { ...state, loaded: true, deleted: true }
    )
  ),

  on(EmployeeAction.addRelative, (state) => {
    return { ...state, adding: true, added: false };
  }),

  on(EmployeeAction.handleRelativeError, (state) => {
    return { ...state, adding: false };
  }),

  on(EmployeeAction.updateRelative, (state) => {
    return { ...state, adding: true, added: false };
  }),

  on(EmployeeAction.addDegree, (state) => {
    return { ...state, adding: true, added: false };
  }),

  on(EmployeeAction.handleDegreeError, (state) => {
    return { ...state, adding: false };
  }),

  on(EmployeeAction.updateDegree, (state) => {
    return { ...state, adding: true, added: false };
  }),

  on(EmployeeAction.updateStateEmployee, (state, { scrollX, added }) => {
    return {
      ...state,
      scrollX: scrollX ? scrollX : state.scrollX,
      added: added ? added : state.added,
    };
  })
);

export const { selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();
