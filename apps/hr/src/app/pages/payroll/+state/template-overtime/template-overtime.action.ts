import { createAction, props } from '@ngrx/store';
import { TemplateOvertime } from './template-overtime.interface';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';

export const AddTemplate = createAction(
  '[Add_Template_Overtime] Add Template Overtime',
  props<{ templateOvertime: TemplateOvertime }>()
);

export const AddTemplateSuccess = createAction(
  '[Add_Template_Overtime] Add Template Overtime success',
  props<{ templateOvertime: TemplateOvertime }>()
);

export const loadInit = createAction(
  '[Load_Template_Overtime] Load init',
  props<{
    take?: number,
    skip?: number,
    title?: string,
    price?: number,
    unit?: DatetimeUnitEnum,
    note?: string,
    position?: string
  }>()
);
export const loadInitTempLateSuccess = createAction(
  '[Load_Template_Overtime] Load Template overtime Success',
  props<{ templateOvertime: TemplateOvertime[] }>()
);


export const loadMoreTemplateOverTime = createAction(
  '[Load_Template_Overtime] Load More  Template OverTime',
  props<{
    take: number,
    title?: string,
    price?: number,
    unit?: DatetimeUnitEnum,
    note?: string,
    position?: string
  }>()
);
export const loadMoreTempLateSuccess = createAction(
  '[Load_Template_Overtime] Load More Template overtime Success',
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
  loadMoreTemplateOverTime,
  loadInit,
  AddTemplate,
  AddTemplateSuccess,
  updateTemplate,
  loadInitTempLateSuccess,
  loadMoreTempLateSuccess,
  deleteTemplate
};
