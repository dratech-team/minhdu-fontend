import { createAction, props } from '@ngrx/store';
import { RequestPaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';
import { Payroll } from './payroll.interface';


export const loadPayrolls = createAction(
  '[LOAD_PAYROLL] Load Payrolls',
  props<RequestPaginate>()
);


export const loadPayrollsSuccess = createAction(
  '[LOAD_PAYROLL] Load Payrolls Success',
  props<{ payrolls: Payroll[] }>()
);

export const addPayroll = createAction(
  '[ADD_PAYROLL] Add Payroll',
  props<{payroll:any }>()
);

export const addPayrollSuccess = createAction(
  '[ADD_PAYROLL] Add Payroll Success',
  props<{ payroll: Payroll,}>()
);

export const addSalary = createAction(
  '[ADD_SALARY] Add Salary',
  props<{ payrollId: number, salary: any }>()
);

export const getPayroll = createAction(
  '[GET_PAYROLL] Get Payroll',
  props<{ id: number}>()
);

export const getPayrollSuccess = createAction(
  '[GET_PAYROLL] Get Payroll Success',
  props<{payroll: Payroll}>()
);

export const updatePayroll = createAction(
  '[UPDATE_PAYROLL] Update Payroll ',
  props<{ id: number, Payroll: any }>()
);

export const updatePayrollSuccess = createAction(
  '[UPDATE_PAYROLL] Update Payroll Success',
  props<{ payroll: Update<Payroll>}>()
);

export const updateSalary = createAction(
  '[UPDATE_SALARY] Update Salary ',
  props<{ id?: number,payrollId: number ,salary:any}>()
);

export const deletePayroll = createAction(
  '[DELETE_PAYROLL] Delete Payroll',
  props<{ id: number }>()
);

export const deletePayrollSuccess = createAction(
  '[DELETE_PAYROLL] Delete Payroll Success',
  props<{id: number}>()
);

export const deleteSalary = createAction(
  '[DELETE_SALARY] Delete Salary',
  props<{ id: number, PayrollId: number }>()
);


export const PayrollAction = {
  loadPayrolls,
  loadPayrollsSuccess,
  addPayroll,
  addPayrollSuccess,
  addSalary,
  getPayroll,
  getPayrollSuccess,
  updatePayroll,
  updatePayrollSuccess,
  updateSalary,
  deletePayroll,
  deletePayrollSuccess,
  deleteSalary,
};
