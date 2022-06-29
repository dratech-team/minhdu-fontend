import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Department } from '@minhdu-fontend/data-models';
import { DepartmentActions } from './department.actions';

export const DEPARTMENT_FEATURE_KEY = 'department';

export interface departmentState extends EntityState<Department> {
  selectedId?: string | number;
  loaded: boolean;
  error?: string | null;
}

export interface DepartmentPartialState {
  readonly [DEPARTMENT_FEATURE_KEY]: departmentState;
}

export const departmentAdapter: EntityAdapter<Department> =
  createEntityAdapter<Department>();

export const initialState: departmentState = departmentAdapter.getInitialState({
  loaded: false,
});
const departmentReducer = createReducer(
  initialState,
  on(DepartmentActions.loadDepartment, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(DepartmentActions.loadDepartmentSuccess, (state, { departments }) =>
    departmentAdapter.setAll(departments, { ...state, loaded: true })
  ),
  on(DepartmentActions.loadDepartmentFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: departmentState | undefined, action: Action) {
  return departmentReducer(state, action);
}
