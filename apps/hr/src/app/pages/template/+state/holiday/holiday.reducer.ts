import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HolidayAction } from './holiday.action';
import { Holiday } from './holiday.interface';
import { PayrollAction } from '../../../payroll/+state/payroll/payroll.action';

export interface holidayState extends EntityState<Holiday> {
  loaded: boolean,
  adding?: boolean,
  added?: boolean,
  branch?: string,
  position?: string,
  total: number
}

export const adapter: EntityAdapter<Holiday> = createEntityAdapter<Holiday>();

export const initialHoliday = adapter.getInitialState({
  loaded: false, added: false, adding: false, branch: '', position: '', total: 0
});

export const HolidayReducer = createReducer(
  initialHoliday,
  on(HolidayAction.LoadInit, (state, _) => {
      return { ...state, loaded: false, branch: '', position: '' };
    }
  ),

  on(HolidayAction.LoadInitHolidaySuccess, (state, action) =>
    adapter.setAll(action.holidays, { ...state, loaded: true, adding: false, added: true, total: action.total })),

  on(HolidayAction.LoadMoreHolidaySuccess, (state, action) =>
    adapter.addMany(action.holidays, { ...state, loaded: true, total: action.total })),

  on(HolidayAction.UpdateHoliday, (state, _) => {
      return { ...state, added: false, adding: true };
    }
  ),

  on(HolidayAction.AddHoliday, (state, _) => {
      return { ...state, added: false, adding: true };
    }
  ),

  on(HolidayAction.AddHolidaySuccess, (state, action) =>
    adapter.setOne(action.holiday, { ...state, loaded: true, adding: false, added: true, total: state.total + 1 })
  ),

  on(HolidayAction.handleHolidayError, (state, _) => {
      return { ...state, added: false, adding: false };
    }
  ),
  on(HolidayAction.getHoliday, (state, _) => {
    return { ...state, loaded: false };
  }),

  on(HolidayAction.getHolidaySuccess, (state, { holiday }) => {
      return adapter.upsertOne(holiday, { ...state, loaded: true, added: true });
    }
  ),
  on(HolidayAction.updateStateHoliday, (state, { branch, position }) => {
    return { ...state, branch: branch ? branch : state.branch, position: position ? position : state.position };
  })
);

export const { selectAll, selectTotal } = adapter.getSelectors();
