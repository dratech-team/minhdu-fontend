import { createAction, props } from '@ngrx/store';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { TemplateSalary } from './template-salary';

export const AddTemplate = createAction(
  '[Add_Template_Salary] Add Template Salary',
  props<{ template: Partial<TemplateSalary> }>()
);


export const HandelTemplateError = createAction(
  '[API_Template_Salary] Template Salary  Error'
);

export const AddTemplateSuccess = createAction(
  '[Add_Template_Salary] Add Template Salary success',
  props<{ template: TemplateSalary }>()
);
export const loadALlTemplate = createAction(
  '[LOAD_Template_Salary] Load All Template Salary',
  props<{ salaryType?: SalaryTypeEnum }>()
);

export const loadInit = createAction(
  '[Load_Template_Salary] Load init',
  props<{
    take: number,
    skip: number,
    title?: string,
    price?: number,
    unit?: DatetimeUnitEnum,
    note?: string,
    position?: string,
    department?: string,
    branch?: string,
  }>()
);
export const loadInitTempLateSuccess = createAction(
  '[Load_Template_Salary] Load Template Salary Success',
  props<{ templateSalary: TemplateSalary[] }>()
);


export const loadMoreTemplateBasic = createAction(
  '[Load_Template_Salary] Load More Salary Basic',
  props<{
    take: number,
    title?: string,
    price?: number,
    unit?: DatetimeUnitEnum,
    note?: string,
    position?: string,
    department?: string,
    branch?: string
  }>()
);
export const loadMoreTempLateSuccess = createAction(
  '[Load_Template_Salary] Load More Template Salary Success',
  props<{ templateSalary: TemplateSalary[] }>()
);

export const updateTemplate = createAction(
  '[UPDATE_Template_Salary] Update Template Salary',
  props<{ id: number, template: Partial<TemplateSalary> }>()
);

export const deleteTemplate = createAction(
  '[DELETE_Template_Salary] Delete Template Salary',
  props<{ id: number }>()
);


export const TemplateSalaryAction = {
  loadALlTemplate,
  loadInit,
  AddTemplate,
  AddTemplateSuccess,
  HandelTemplateError,
  updateTemplate,
  loadInitTempLateSuccess,
  loadMoreTemplateBasic,
  loadMoreTempLateSuccess,
  deleteTemplate
};
