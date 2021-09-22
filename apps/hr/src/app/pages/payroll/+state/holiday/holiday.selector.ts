import { holidayState } from './holiday.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromHoliday from './holiday.reducer';
import { selectorEmployeeState } from '@minhdu-fontend/employee';


export interface state {
  holiday: holidayState;
}

export const selectorHolidayState = createFeatureSelector<holidayState>(
  FeatureName.HOLIDAY
);

export const selectorAllHoliday = createSelector(
  selectorHolidayState,
  fromHoliday.selectAll
);
export const selectorHolidayTotal = createSelector(
  selectorHolidayState,
  fromHoliday.selectTotal
);
export const selectHolidayLoaded = createSelector(
  selectorHolidayState,
  (state) => {
    return state.loaded;
  }
);
