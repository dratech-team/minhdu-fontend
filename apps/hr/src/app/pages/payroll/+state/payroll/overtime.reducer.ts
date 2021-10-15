import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PayrollAction } from './payroll.action';
import { Overtime } from '../../../../../../../../libs/data-models/hr/salary/overtime';

export interface overtimeState extends EntityState <Overtime> {
  loaded: boolean,
  added: boolean,
  adding: boolean,
  selectedSalaryId: number
}

export const adapterOvertime: EntityAdapter<Overtime> = createEntityAdapter<Overtime>();
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
