import { createAction, props } from '@ngrx/store';
import { ReqOvertime, TemplateOvertime, TemplateOvertimeDTO } from './template-overtime.interface';

export const AddTemplate = createAction(
  '[Add_Template_Overtime] Add Template Overtime',
  props<{ template: ReqOvertime }>()
);

export const AddTemplateSuccess = createAction(
  '[Add_Template_Overtime] Add Template Overtime success',
  props<{ templateOvertime: TemplateOvertime }>()
);

export const HandleTemplateError = createAction(
  '[API_Template_Overtime]  Template Overtime Error'
);
export const loadALlTemplate = createAction(
  '[LOAD_TEMPLATE_OVERTIME] Load All Template Overtime',
  props<{ positionId?: number | '', unit?: string, branchId?: number }>()
);

export const loadInit = createAction(
  '[Load_Template_Overtime] Load init',
  props<{
    templateOvertimeDTO: TemplateOvertimeDTO
  }>()
);
export const loadInitTempLateSuccess = createAction(
  '[Load_Template_Overtime] Load Template overtime Success',
  props<{ templateOvertimes: TemplateOvertime[], total: number }>()
);


export const loadMoreTemplateOverTime = createAction(
  '[Load_Template_Overtime] Load More Template OverTime',
  props<{
    templateOvertimeDTO: TemplateOvertimeDTO
  }>()
);
export const loadMoreTempLateSuccess = createAction(
  '[Load_Template_Overtime] Load More Template overtime Success',
  props<{ templateOvertimes: TemplateOvertime[], total: number }>()
);

export const updateTemplate = createAction(
  '[UPDATE_TEMPLATE_OVERTIME] Update Template Overtime',
  props<{ id: number, templateOvertime: Partial<TemplateOvertime> }>()
);

export const deleteTemplate = createAction(
  '[DELETE_TEMPLATE_OVERTIME] Delete Template Overtime',
  props<{ id: number }>()
);


export const TemplateOvertimeAction = {
  loadALlTemplate,
  loadInit,
  loadMoreTemplateOverTime,
  AddTemplate,
  AddTemplateSuccess,
  HandleTemplateError,
  updateTemplate,
  loadInitTempLateSuccess,
  loadMoreTempLateSuccess,
  deleteTemplate
};
