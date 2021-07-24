import { createAction, props } from '@ngrx/store';
import { Holiday } from './holiday.interface';


export const AddHoliday = createAction(
  '[Add_HOLIDAY] Add HOLIDAY',
  props<{ holiday: any }>()
);

export const AddHolidaySuccess = createAction(
  '[Add_HOLIDAY] Add Add HOLIDAY success',
  props<{ holiday: Holiday }>()
);

export const LoadAllHoliday = createAction(
  '[Load_HOLIDAY] Load holiday'
);

export const LoadAllHolidaySuccess = createAction(
  '[Load_HOLIDAY] Load holiday overtime Success',
  props<{ holidays: Holiday[] }>()
);

export const UpdateHoliday = createAction(
  '[UPDATE_HOLIDAY] Update Holiday',
  props<{ id: number, holiday: any }>()
);

export const DeleteHoliday = createAction(
  '[DELETE_HOLIDAY] Delete Holiday',
  props<{ id: number }>()
);


export const HolidayAction = {
  AddHoliday,
  AddHolidaySuccess,
  LoadAllHoliday,
  LoadAllHolidaySuccess,
  UpdateHoliday,
  DeleteHoliday
};
