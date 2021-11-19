import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction } from './payroll.action';
import { PayrollSalary } from '../../../../../../../../libs/data-models/hr/salary/payroll-salary';


export interface overtimeState extends EntityState <PayrollSalary> {
  loaded: boolean,
  added: boolean,
  adding: boolean,
  selectedSalaryId: number
}

export const adapterOvertime: EntityAdapter<PayrollSalary> = createEntityAdapter<PayrollSalary>();
export const initialOvertime = adapterOvertime.getInitialState({ loaded: false, added: false, adding: false });
export const OvertimeReducer = createReducer(
  initialOvertime,
  on(PayrollAction.filterOvertimeSuccess, (state, action) =>
    adapterOvertime.setOne(action.overtime, { ...state, loaded: true, added: true, adding: false }))
);
export const {
  selectEntities,
  selectAll,
  selectTotal
} = adapterOvertime.getSelectors();
