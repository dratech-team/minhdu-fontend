import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity/src/models';
import { Payroll } from './payroll.interface';
import { Salary } from '@minhdu-fontend/data-models';

export const loadInit = createAction(
  '[LOAD_PAYROLL] Load Payrolls',
  props<{
    take?: number,
    skip?: number,
    name?: string,
    code?: string,
    position?: string,
    department?: string,
    branch?: string,
    createdAt?: Date,
    paidAt?: boolean,
    accConfirmedAt?: boolean,
    employeeId?: number
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_PAYROLL] Load Payrolls Success',
  props<{ payrolls: Payroll[] }>()
);
export const loadMorePayrolls = createAction(
  '[LOAD_PAYROLL] Load More Payrolls',
  props<{
    take: number,
    skip: number,
    createdAt?: Date,
    name?: string,
    code?: string,
    position?: string,
    department?: string,
    branch?: string,
    paidAt?: boolean,
    accConfirmedAt?: boolean,
  }>()
);

export const loadMorePayrollsSuccess = createAction(
  '[LOAD_PAYROLL] Load More Payrolls Success',
  props<{ payrolls: Payroll[] }>()
);

export const loadSalaryInit = createAction(
  '[LOAD_PAYROLL] Load Salary Init',
  props<{
    take?: number,
    skip?: number,
    title?: string,
    createdAt?: Date
  }>()
);

export const loadMoreSalary = createAction(
  '[LOAD_PAYROLL] Load More Salary',
  props<{
    take?: number,
    skip?: number,
    title?: string,
    createdAt?: Date
  }>()
);

export const loadSalaryInitSuccess = createAction(
  '[LOAD_SALARY] Load Salary Success',
  props<{ salary: Salary[] }>()
);

export const loadMoreSalarySuccess = createAction(
  '[LOAD_SALARY] Load Salary Success',
  props<{ salary: Salary[] }>()
);

export const addPayroll = createAction(
  '[ADD_PAYROLL] Add Payroll',
  props<{ generate: any, addOne?: boolean, inHistory?: boolean }>()
);

export const addPayrollSuccess = createAction(
  '[ADD_PAYROLL] Add Payroll Success'
);

export const handlePayrollError = createAction(
  '[API_PAYROLL]  Payroll Error'
);

export const addSalary = createAction(
  '[ADD_SALARY] Add Salary',
  props<{ salary: any, payrollId?: number }>()
);

export const handleSalaryError = createAction(
  '[API_SALARY] Salary Error '
);

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
  props<{ id: number, Payroll: any }>()
);


export const confirmPayroll = createAction(
  '[CONFIRM_PAYROLL] Confirm Payroll',
  props<{ id: number, dataConfirm:any}>()
);

export const updatePayrollSuccess = createAction(
  '[UPDATE_PAYROLL] Update Payroll Success',
  props<{ payroll: Update<Payroll> }>()
);

export const confirmPayrollSuccess = createAction(
  '[UPDATE_PAYROLL] Confirm Payroll Success',
  props<{ payroll: Payroll }>()
);

export const updateSalary = createAction(
  '[UPDATE_SALARY] Update Salary ',
  props<{ payrollId: number, salary: any, id?: number }>()
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
  props<{ id: number, PayrollId: number }>()
);

export const scanHoliday = createAction(
  '[SCAN_HOLIDAY] Scan Holiday',
  props<{ PayrollId: number }>()
);

export const scanHolidayError = createAction(
  '[SCAN_HOLIDAY] Scan Holiday Error'
);


export const PayrollAction = {
  loadInit,
  loadInitSuccess,
  loadMorePayrolls,
  loadMorePayrollsSuccess,
  loadSalaryInit,
  loadMoreSalary,
  loadSalaryInitSuccess,
  loadMoreSalarySuccess,
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
  confirmPayrollSuccess
};
