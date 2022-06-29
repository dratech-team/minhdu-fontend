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
  '[API_HOLIDAY] Handle HOLIDAY Error'
);

export const LoadAllHoliday = createAction('[Load_HOLIDAY] Load All holiday');

export const LoadInit = createAction(
  '[Load_HOLIDAY] Load Init holiday',
  props<{ holidayDTO: HolidayDTO }>()
);

export const LoadInitHolidaySuccess = createAction(
  '[Load_HOLIDAY] Load holiday Success',
  props<{ holidays: Holiday[]; total: number }>()
);

export const LoadMoreHoliday = createAction(
  '[Load_HOLIDAY] Load More holiday',
  props<{ holidayDTO: HolidayDTO }>()
);

export const LoadMoreHolidaySuccess = createAction(
  '[Load_HOLIDAY] Load More holiday Success',
  props<{ holidays: Holiday[]; total: number }>()
);

export const UpdateHoliday = createAction(
  '[UPDATE_HOLIDAY] Update Holiday',
  props<{ id: number; holiday: any; updateDetail: boolean }>()
);

export const DeleteHoliday = createAction(
  '[DELETE_HOLIDAY] Delete Holiday',
  props<{ id: number }>()
);
export const getHoliday = createAction(
  '[GET_HOLIDAY] Get One Holiday',
  props<{
    id: number;
    params?: {
      position?: string;
      branch?: string;
      code?: number;
      name?: string;
    };
  }>()
);

export const getHolidaySuccess = createAction(
  '[GET_HOLIDAY] Get One Holiday Success',
  props<{ holiday: Holiday }>()
);

export const updateStateHoliday = createAction(
  '[State_HOLIDAY] Update state Holiday ',
  props<{ branch?: string; position?: string }>()
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
  DeleteHoliday,
  getHoliday,
  getHolidaySuccess,
  updateStateHoliday,
};
