import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity/src/models';
import { Payroll } from './payroll.interface';

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

export const addPayroll = createAction(
  '[ADD_PAYROLL] Add Payroll',
  props<{ payroll: any }>()
);

export const addPayrollSuccess = createAction(
  '[ADD_PAYROLL] Add Payroll Success',
  props<{ payroll: Payroll, }>()
);

export const addSalary = createAction(
  '[ADD_SALARY] Add Salary',
  props<{ salary: any, payrollId?: number }>()
);

export const handleSalaryError = createAction(
  '[API_SALARY] Salary Error ',
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
  props<{ id: number}>()
)

export const updatePayrollSuccess = createAction(
  '[UPDATE_PAYROLL] Update Payroll Success',
  props<{ payroll: Update<Payroll> }>()
);

export const updateSalary = createAction(
  '[UPDATE_SALARY] Update Salary ',
  props<{  payrollId: number, salary: any ,id?: number  }>()
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


export const PayrollAction = {
  loadInit,
  loadInitSuccess,
  loadMorePayrolls,
  loadMorePayrollsSuccess,
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
  deleteSalary
};
