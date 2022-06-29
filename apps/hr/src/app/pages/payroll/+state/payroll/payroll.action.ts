import { ConvertBooleanFrontEnd, FilterTypeEnum } from '@minhdu-fontend/enums';
import { UpdateNum } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';
import { PayrollSalary } from '../../../../../../../../libs/data-models/hr/salary/payroll-salary';
import { Payroll, PayrollDTO } from './payroll.interface';
import {
  Branch,
  Position,
  RangeDay,
  totalSalary,
} from '@minhdu-fontend/data-models';

export const loadInit = createAction(
  '[LOAD_PAYROLL] Load Payrolls',
  props<{ payrollDTO: PayrollDTO }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_PAYROLL] Load Payrolls Success',
  props<{ payrolls: Payroll[]; total: number; totalOvertime?: totalSalary }>()
);
export const loadMorePayrolls = createAction(
  '[LOAD_PAYROLL] Load More Payrolls',
  props<{ payrollDTO: PayrollDTO }>()
);

export const loadMorePayrollsSuccess = createAction(
  '[LOAD_PAYROLL] Load More Payrolls Success',
  props<{ payrolls: Payroll[]; total: number; totalOvertime?: totalSalary }>()
);

export const filterOvertime = createAction(
  '[LOAD_PAYROLL] Filter overtime Init',
  props<{
    take?: number;
    skip?: number;
    title?: string;
    startAt?: any;
    endAt?: any;
  }>()
);

export const filterOvertimeSuccess = createAction(
  '[LOAD_SALARY] Filter overtime Success',
  props<{ overtime: PayrollSalary }>()
);
export const addPayroll = createAction(
  '[ADD_PAYROLL] Add Payroll',
  props<{ generate: any; addOne?: boolean; inHistory?: boolean }>()
);

export const addPayrollSuccess = createAction(
  '[ADD_PAYROLL] Add Payroll Success'
);

export const handlePayrollError = createAction('[API_PAYROLL]  Payroll Error');

export const addSalary = createAction(
  '[ADD_SALARY] Add Salary',
  props<{
    salary: any;
    payrollId?: number;
    isTimesheet?: boolean;
    isDetailPayroll?: boolean;
    branchId?: number;
  }>()
);

export const addSalaryMultipleSuccess = createAction(
  '[UPDATE_SALARY] Add Salary Multiple Success '
);

export const handleSalaryError = createAction('[API_SALARY] Salary Error ');

export const getPayroll = createAction(
  '[GET_PAYROLL] Get Payroll',
  props<{ id?: number }>()
);

export const getPayrollSuccess = createAction(
  '[GET_PAYROLL] Get Payroll Success',
  props<{ payroll: Payroll }>()
);

export const updatePayroll = createAction(
  '[UPDATE_PAYROLL] Update Payroll ',
  props<{ id: number; payroll: any }>()
);

export const confirmPayroll = createAction(
  '[CONFIRM_PAYROLL] Confirm Payroll',
  props<{ id: number; dataConfirm: { datetime?: Date | null } }>()
);

export const updatePayrollSuccess = createAction(
  '[UPDATE_PAYROLL] Update Payroll Success',
  props<{ payroll: Payroll }>()
);

export const confirmPayrollSuccess = createAction(
  '[UPDATE_PAYROLL] Confirm Payroll Success',
  props<{ payroll: Payroll }>()
);

export const updateSalary = createAction(
  '[UPDATE_SALARY] Update Salary ',
  props<{
    salary: any;
    payrollId?: number;
    id?: number;
    branchId?: number;
    multiple?: boolean;
  }>()
);

export const updateSalaryMultipleSuccess = createAction(
  '[UPDATE_SALARY] Update Salary Multiple Success '
);

export const deletePayroll = createAction(
  '[DELETE_PAYROLL] Delete Payroll',
  props<{ id: number }>()
);

export const deletePayrollSuccess = createAction(
  '[DELETE_PAYROLL] Delete Payroll Success',
  props<{ id: number }>()
);

export const deleteSalary = createAction(
  '[DELETE_SALARY] Delete Salary',
  props<{ id: number; PayrollId?: number }>()
);

export const scanHoliday = createAction(
  '[SCAN_HOLIDAY] Scan Holiday',
  props<{ PayrollId: number }>()
);

export const scanHolidayError = createAction(
  '[SCAN_HOLIDAY] Scan Holiday Error'
);

export const updateStateBranch = createAction(
  '[UPDATE_STATE_BRANCH] UPDATE STATE Branch Payroll',
  props<{ branch: Branch }>()
);

export const updateStatePosition = createAction(
  '[UPDATE_STATE_POSITION] UPDATE STATE Position Payroll',
  props<{ position: Position }>()
);

export const updateStatePayroll = createAction(
  '[UPDATE_STATE_PAYROLL] UPDATE STATE PAYROLL Payroll',
  props<{
    empStatus?: number;
    filter?: FilterTypeEnum;
    rangeDay?: RangeDay;
    added?: ConvertBooleanFrontEnd;
  }>()
);

export const deleteSalarySuccess = createAction(
  '[Delete_Salary] Delete Salary Success'
);
export const PayrollAction = {
  loadInit,
  loadInitSuccess,
  loadMorePayrolls,
  loadMorePayrollsSuccess,
  filterOvertime,
  filterOvertimeSuccess,
  addPayroll,
  addPayrollSuccess,
  handleSalaryError,
  addSalary,
  getPayroll,
  getPayrollSuccess,
  updatePayroll,
  updatePayrollSuccess,
  confirmPayroll,
  updateSalary,
  deletePayroll,
  deletePayrollSuccess,
  deleteSalary,
  handlePayrollError,
  scanHoliday,
  scanHolidayError,
  confirmPayrollSuccess,
  updateStatePayroll,
  deleteSalarySuccess,
  updateSalaryMultipleSuccess,
  addSalaryMultipleSuccess,
  updateStateBranch,
  updateStatePosition,
};
