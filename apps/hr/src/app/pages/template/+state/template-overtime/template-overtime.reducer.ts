import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { TemplateOvertime } from './template-overtime.interface';
import { createReducer, on } from '@ngrx/store';
import { TemplateOvertimeAction } from './template-overtime.action';

export interface templateOvertimeState extends EntityState<TemplateOvertime> {
  loaded: boolean,
  added?: boolean,
  adding?: boolean,
  total: number
}

export const adapter: EntityAdapter<TemplateOvertime> = createEntityAdapter<TemplateOvertime>();

export const initialTemplateOvertime = adapter.getInitialState({
  loaded: false,
  added: false,
  adding: false,
  total: 0
});

export const templateOvertimeReducer = createReducer(
  initialTemplateOvertime,
  on(TemplateOvertimeAction.loadInitTempLateSuccess, (state, action) =>
    adapter.setAll(action.templateOvertimes, {
      ...state,
      loaded: true,
      added: true,
      adding: false,
      total: action.total
    })),

  on(TemplateOvertimeAction.loadMoreTempLateSuccess, (state, action) =>
    adapter.addMany(action.templateOvertimes, { ...state, loaded: true, total: action.total })),

  on(TemplateOvertimeAction.AddTemplate, (state, _) => {
      return { ...state, added: false, adding: true };
    }
  ),

  on(TemplateOvertimeAction.updateTemplate, (state, _) => {
      return { ...state, added: false, adding: true };
    }
  ),
  on(TemplateOvertimeAction.AddTemplateSuccess, (state, action) =>
    adapter.setOne(action.templateOvertime, { ...state, added: true, adding: false, total: state.total + 1 })
  ),

  on(TemplateOvertimeAction.HandleTemplateError, (state, _) => {
      console.log(state);
      return { ...state, added: false, adding: false };
    }
  )
);

export const { selectAll, selectTotal } = adapter.getSelectors();
