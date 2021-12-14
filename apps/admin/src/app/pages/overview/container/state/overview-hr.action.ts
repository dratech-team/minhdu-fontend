import { createAction, props } from '@ngrx/store';
import { MenuEnum } from '@minhdu-fontend/enums';

export const updateState = createAction(
  '[UPDATE_STATE_OVERVIEW_HR] Update State ',
  props<{ state: any }>()
);

export const LoadAll = createAction(
  '[LOAD_ALL_OVERVIEW_HR] Update State ',
  props<{ typeOverview: string }>()
);

export const loadInit = createAction(
  '[LOAD_INIT_SALARY_EMPLOYEE] Load Salary Employee ',
  props<{ typeOverview: string, take?: number, skip?: number }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_INIT_SALARY_EMPLOYEE_SUCCESS] Load Salary Employee ',
  props<{ payroll: any [] }>()
);

export const loadMore = createAction(
  '[LOAD_MORE_SALARY_EMPLOYEE] Load More Salary Employee ',
  props<{ typeOverview: string, take?: number, skip?: number }>()
);

export const loadMoreSuccess = createAction(
  '[LOAD_MORE_SALARY_EMPLOYEE_SUCCESS] Load More Salary Employee ',
  props<{ typeOverview: string, take?: number, skip?: number }>()
);


export const OverviewHrAction = {
  updateState,
  LoadAll,
  loadInit,
  loadInitSuccess,
  loadMore,
  loadMoreSuccess
};
