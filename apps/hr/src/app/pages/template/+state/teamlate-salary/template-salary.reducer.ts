import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { TemplateSalary } from './template-salary';
import { TemplateSalaryAction } from './template-salary.action';


export interface templateSalaryState extends EntityState<TemplateSalary> {
  loaded: boolean,
  added?: boolean,
  adding?: boolean,
}

export const adapter: EntityAdapter<TemplateSalary> = createEntityAdapter<TemplateSalary>();

export const initialTemplateBasic = adapter.getInitialState({ loaded: false, added: false, adding: false });

export const templateSalaryReducer = createReducer(
  initialTemplateBasic,
  on(TemplateSalaryAction.loadInitTempLateSuccess, (state, action) => {
      return adapter.setAll(action.templateSalary, { ...state, loaded: true, added: true, adding: false });
    }
  ),
  on(TemplateSalaryAction.loadMoreTempLateSuccess, (state, action) =>
    adapter.addMany(action.templateSalary, { ...state, loaded: true })),

  on(TemplateSalaryAction.AddTemplateSuccess, (state, action) =>
    adapter.setOne(action.template, { ...state, loaded: true, added: true, adding: false })
  ),
  on(TemplateSalaryAction.AddTemplate, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),
  on(TemplateSalaryAction.updateTemplate, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),
  on(TemplateSalaryAction.HandelTemplateError, (state, _) => {
      return { ...state, adding: false, added: false };
    }
  )
);


export const { selectAll, selectTotal } = adapter.getSelectors();
