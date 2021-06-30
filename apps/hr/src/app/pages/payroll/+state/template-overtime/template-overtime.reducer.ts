import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TemplateOvertime } from './template-overtime.interface';
import { createReducer, on } from '@ngrx/store';
import { TemplateOvertimeAction } from './template-overtime.action';

export interface templateOvertimeState extends EntityState<TemplateOvertime> {
  loaded: boolean,
}

export const adapter: EntityAdapter<TemplateOvertime> = createEntityAdapter<TemplateOvertime>();

export const initialTemplateOvertime = adapter.getInitialState({ loaded: false });

export const templateOvertimeReducer = createReducer(
  initialTemplateOvertime,
  on(TemplateOvertimeAction.loadAllTempLateSuccess, (state, action) =>
    adapter.setAll(action.templateOvertime, { ...state, loaded: true })),
  on(TemplateOvertimeAction.AddTemplateSuccess, (state, action) =>
    adapter.setOne(action.templateOvertime, { ...state, loaded: true })
  )
);

export const { selectAll } = adapter.getSelectors();
