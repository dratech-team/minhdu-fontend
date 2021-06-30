import { createAction, props } from '@ngrx/store';
import { TemplateOvertime } from './template-overtime.interface';

export const AddTemplate = createAction(
  '[Add_Template_Overtime] Add Template Overtime',
  props<{ templateOvertime: TemplateOvertime }>()
);

export const AddTemplateSuccess = createAction(
  '[Add_Template_Overtime] Add Template Overtime success',
  props<{ templateOvertime: TemplateOvertime }>()
);

export const loadAllTempLate = createAction(
  '[Load_Template_Overtime] Load Template overtime'
);

export const loadAllTempLateSuccess = createAction(
  '[Load_Template_Overtime] Load Template overtime Success',
  props<{ templateOvertime: TemplateOvertime[] }>()
);

export const updateTemplate = createAction(
  '[UPDATE_TEMPLATE_OVERTIME] Update Template Overtime',
  props<{ id: number, templateOvertime: TemplateOvertime }>()
);

export const deleteTemplate = createAction(
  '[DELETE_TEMPLATE_OVERTIME] Delete Template Overtime',
  props<{ id: number }>()
);


export const TemplateOvertimeAction = {
  AddTemplate,
  AddTemplateSuccess,
  updateTemplate,
  loadAllTempLate,
  loadAllTempLateSuccess,
  deleteTemplate
};
