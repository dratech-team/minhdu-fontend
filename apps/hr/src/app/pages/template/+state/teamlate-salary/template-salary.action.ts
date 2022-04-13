import { createAction, props } from '@ngrx/store';
import { SalaryTypeEnum } from '@minhdu-fontend/enums';
import { SalarySetting, TemplateSalaryDTO } from './salary-setting';

export const AddTemplate = createAction(
  '[Add_Template_Salary] Add Template Salary',
  props<{ template: Partial<SalarySetting> }>()
);


export const HandelTemplateError = createAction(
  '[API_Template_Salary] Template Salary  Error'
);

export const AddTemplateSuccess = createAction(
  '[Add_Template_Salary] Add Template Salary success',
  props<{ template: SalarySetting }>()
);
export const loadALlTemplate = createAction(
  '[LOAD_Template_Salary] Load All Template Salary',
  props<{ salaryType?: SalaryTypeEnum }>()
);

export const loadInit = createAction(
  '[Load_Template_Salary] Load init',
  props<{ templateSalaryDTO: TemplateSalaryDTO }>()
);
export const loadInitTempLateSuccess = createAction(
  '[Load_Template_Salary] Load Template Salary Success',
  props<{ templateSalary: SalarySetting[], total: number }>()
);


export const loadMoreTemplateBasic = createAction(
  '[Load_Template_Salary] Load More Salary Basic',
  props<{ templateSalaryDTO: TemplateSalaryDTO }>()
);
export const loadMoreTempLateSuccess = createAction(
  '[Load_Template_Salary] Load More Template Salary Success',
  props<{ templateSalary: SalarySetting[], total: number }>()
);

export const updateTemplate = createAction(
  '[UPDATE_Template_Salary] Update Template Salary',
  props<{ id: number, template: Partial<SalarySetting> }>()
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
