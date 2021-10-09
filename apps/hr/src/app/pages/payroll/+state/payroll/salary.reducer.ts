import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Salary } from '@minhdu-fontend/data-models';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction } from './payroll.action';

export interface SalaryState extends EntityState <Salary> {
  loaded: boolean,
  added: boolean,
  adding: boolean,
  selectedSalaryId: number
}

export const adapterSalary: EntityAdapter<Salary> = createEntityAdapter<Salary>();
export const initialSalary = adapterSalary.getInitialState({ loaded: false, added: false, adding: false });
export const SalaryReducer = createReducer(
  initialSalary,

  on(PayrollAction.loadSalaryInitSuccess, (state, action) =>
    adapterSalary.setAll(action.salary, { ...state, loaded: true, added: true, adding: false })),

  on(PayrollAction.loadMoreSalarySuccess, (state, action) =>
    adapterSalary.addMany(action.salary, { ...state, loaded: true, added: true, adding: false }))
);
export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapterSalary.getSelectors();
