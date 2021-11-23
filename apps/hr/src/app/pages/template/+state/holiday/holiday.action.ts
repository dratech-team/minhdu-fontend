import { createAction, props } from '@ngrx/store';
import { Holiday, HolidayDTO } from './holiday.interface';


export const AddHoliday = createAction(
  '[Add_HOLIDAY] Add HOLIDAY',
  props<{ holiday: any }>()
);

export const AddHolidaySuccess = createAction(
  '[Add_HOLIDAY] Add Add HOLIDAY success',
  props<{ holiday: Holiday }>()
);

export const handleHolidayError = createAction(
  '[API_HOLIDAY] Handle HOLIDAY Error',
);

export const LoadAllHoliday = createAction(
  '[Load_HOLIDAY] Load All holiday'
);

export const LoadInit = createAction(
  '[Load_HOLIDAY] Load Init holiday',
  props<{ holidayDTO: HolidayDTO }>()
);

export const LoadInitHolidaySuccess = createAction(
  '[Load_HOLIDAY] Load holiday Success',
  props<{ holidays: Holiday[] }>()
);

export const LoadMoreHoliday = createAction(
  '[Load_HOLIDAY] Load More holiday',
  props<{holidayDTO: HolidayDTO }>()
);

export const LoadMoreHolidaySuccess = createAction(
  '[Load_HOLIDAY] Load More holiday Success',
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
  handleHolidayError,
  LoadAllHoliday,
  LoadInit,
  LoadInitHolidaySuccess,
  LoadMoreHoliday,
  LoadMoreHolidaySuccess,
  UpdateHoliday,
  DeleteHoliday
};
