import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { SalarySetting } from './salary-setting';
import { TemplateSalaryAction } from './template-salary.action';


export interface templateSalaryState extends EntityState<SalarySetting> {
  loaded: boolean,
  added?: boolean,
  adding?: boolean,
  total: number
}

export const adapter: EntityAdapter<SalarySetting> = createEntityAdapter<SalarySetting>();

export const initialTemplateBasic = adapter.getInitialState({ loaded: false, added: false, adding: false, total: 0 });

export const templateSalaryReducer = createReducer(
  initialTemplateBasic,
  on(TemplateSalaryAction.loadInitTempLateSuccess, (state, action) => {
      return adapter.setAll(action.templateSalary, {
        ...state,
        loaded: true,
        added: true,
        adding: false,
        total: action.total
      });
    }
  ),
  on(TemplateSalaryAction.loadMoreTempLateSuccess, (state, action) =>
    adapter.addMany(action.templateSalary, { ...state, loaded: true, total: action.total })),

  on(TemplateSalaryAction.AddTemplateSuccess, (state, action) =>
    adapter.setOne(action.template, { ...state, loaded: true, added: true, adding: false, total: state.total + 1 })
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
