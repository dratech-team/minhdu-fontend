import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HolidayAction } from './holiday.action';
import { Holiday } from './holiday.interface';

export interface holidayState extends EntityState<Holiday> {
  loaded: boolean,
}

export const adapter: EntityAdapter<Holiday> = createEntityAdapter<Holiday>();

export const initialHoliday = adapter.getInitialState({ loaded: false });

export const HolidayReducer = createReducer(
  initialHoliday,
  on(HolidayAction.LoadAllHolidaySuccess, (state, action) =>
    adapter.setAll(action.holidays, { ...state, loaded: true })),
  on(HolidayAction.AddHolidaySuccess, (state, action) =>
    adapter.setOne(action.holiday, { ...state, loaded: true })
  )
);

export const { selectAll } = adapter.getSelectors();
