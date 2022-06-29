import { createAction, props } from '@datorama/akita-ng-effects';
import {
  AddPayrollDto,
  LoadOnePayrollDto,
  RemovePayrollDto,
  SearchPayrollDto,
  UpdatePayrollDto,
} from '../dto';
import { ConfirmPayrollDto } from '../dto/confirm-payroll.dto';
import { PayrollEntity } from '../entities';
import { AddManyPayrollDto } from '../dto/add-many-payroll.dto';

export const addOne = createAction('[PAYROLL] Add One', props<AddPayrollDto>());

export const addMany = createAction(
  '[PAYROLL] Add Many',
  props<AddManyPayrollDto>()
);

export const loadAll = createAction(
  '[PAYROLL] Load All',
  props<SearchPayrollDto>()
);

export const loadOne = createAction(
  '[PAYROLL] Load One',
  props<LoadOnePayrollDto>()
);

export const update = createAction(
  '[PAYROLL] Update ',
  props<UpdatePayrollDto>()
);

export const confirmPayroll = createAction(
  '[CONFIRM_PAYROLL] Confirm Payroll',
  props<ConfirmPayrollDto>()
);

/**
 * @deprecated
 * */
export const scanHoliday = createAction(
  '[PAYROLL] Scan Holiday',
  props<{ payrollId: number }>()
);

export const restore = createAction(
  '[PAYROLL] Restore',
  props<{ id: PayrollEntity['id'] }>()
);

export const remove = createAction(
  '[PAYROLL] Remove',
  props<RemovePayrollDto>()
);

export const error = createAction(
  '[PAYROLL] Error',
  props<{ error: string }>()
);

export const PayrollActions = {
  addOne,
  addMany,
  loadAll,
  loadOne,
  update,
  confirmPayroll,
  scanHoliday,
  restore,
  remove,
  error,
};
