import { createAction, props } from '@ngrx/store';
import { DatetimeUnitEnum } from '@minhdu-fontend/enums';
import { TemplateBasicSalary } from './template-basic-salary';

export const AddTemplate = createAction(
  '[Add_Template_Basic] Add Template Basic',
  props<{ template: {price: number, title: string} }>()
);

export const AddTemplateSuccess = createAction(
  '[Add_Template_Basic] Add Template Basic success',
  props<{ template: TemplateBasicSalary }>()
);
export const loadALlTemplate = createAction(
  '[LOAD_Template_Basic] Load All Template Basic',
);

export const loadInit = createAction(
  '[Load_Template_Basic] Load init',
  props<{
    take: number,
    skip: number,
    title?: string,
    price?: number,
    unit?: DatetimeUnitEnum,
    note?: string,
    position?: string,
    department?: string,
    branch?: string
  }>()
);
export const loadInitTempLateSuccess = createAction(
  '[Load_Template_Basic] Load Template Basic Success',
  props<{ templateBasics: TemplateBasicSalary[] }>()
);


export const loadMoreTemplateBasic = createAction(
  '[Load_Template_Basic] Load More Template Basic',
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
  '[Load_Template_Basic] Load More Template Basic Success',
  props<{ templateBasics: TemplateBasicSalary[] }>()
);

export const updateTemplate = createAction(
  '[UPDATE_Template_Basic] Update Template Basic',
  props<{ id: number, templateBasic: Partial<TemplateBasicSalary> }>()
);

export const deleteTemplate = createAction(
  '[DELETE_Template_Basic] Delete Template Basic',
  props<{ id: number }>()
);


export const TemplateBasicAction = {
  loadALlTemplate,
  loadInit,
  AddTemplate,
  AddTemplateSuccess,
  updateTemplate,
  loadInitTempLateSuccess,
  loadMoreTemplateBasic,
  loadMoreTempLateSuccess,
  deleteTemplate
};
