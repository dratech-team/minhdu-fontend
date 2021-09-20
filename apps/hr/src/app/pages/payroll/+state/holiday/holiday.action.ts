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
  '[Load_HOLIDAY] Load All holiday'
);

export const LoadInit = createAction(
  '[Load_HOLIDAY] Load Init holiday',
  props<{
    take: number,
    skip: number,
    name?: string,
    datetime?: Date,
    department?: string,
    rate?: number,
  }>()
);

export const LoadInitHolidaySuccess = createAction(
  '[Load_HOLIDAY] Load holiday Success',
  props<{ holidays: Holiday[] }>()
);

export const LoadMoreHoliday = createAction(
  '[Load_HOLIDAY] Load More holiday',
  props<{
    take: number,
    name?: string,
    datetime?: Date,
    department?: string,
    rate?: number,
  }>()
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
  LoadAllHoliday,
  LoadInit,
  LoadInitHolidaySuccess,
  LoadMoreHoliday,
  LoadMoreHolidaySuccess,
  UpdateHoliday,
  DeleteHoliday
};
