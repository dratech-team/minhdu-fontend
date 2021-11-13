import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HolidayAction } from './holiday.action';
import { Holiday } from './holiday.interface';

export interface holidayState extends EntityState<Holiday> {
  loaded: boolean,
  adding?: boolean,
  added?: boolean,
}

export const adapter: EntityAdapter<Holiday> = createEntityAdapter<Holiday>();

export const initialHoliday = adapter.getInitialState({ loaded: false, added: false, adding: false });

export const HolidayReducer = createReducer(
  initialHoliday,
  on(HolidayAction.LoadInitHolidaySuccess, (state, action) =>
    adapter.setAll(action.holidays, { ...state, loaded: true, adding: false, added: true })),

  on(HolidayAction.LoadMoreHolidaySuccess, (state, action) =>
    adapter.addMany(action.holidays, { ...state, loaded: true })),

  on(HolidayAction.UpdateHoliday, (state, _) => {
      return { ...state, added: false, adding: true };
    }
  ),

  on(HolidayAction.AddHoliday, (state, _) => {
      return { ...state, added: false, adding: true };
    }
  ),
  on(HolidayAction.AddHolidaySuccess, (state, action) =>
    adapter.setOne(action.holiday, { ...state, loaded: true, adding: false, added: true })
  ),
  on(HolidayAction.handleHolidayError, (state, _) => {
      return { ...state, added: false, adding: false };
    }
  )
);

export const { selectAll, selectTotal } = adapter.getSelectors();
