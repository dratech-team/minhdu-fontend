import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { TemplateBasicSalary } from './template-basic-salary';
import { TemplateBasicAction } from './template-basic-salary.action';


export interface templateBasicState extends EntityState<TemplateBasicSalary> {
  loaded: boolean,
  added?: boolean,
  adding?: boolean,
}

export const adapter: EntityAdapter<TemplateBasicSalary> = createEntityAdapter<TemplateBasicSalary>();

export const initialTemplateBasic = adapter.getInitialState({ loaded: false, added: false, adding: false });

export const templateBasicReducer = createReducer(
  initialTemplateBasic,
  on(TemplateBasicAction.loadInitTempLateSuccess, (state, action) => {
      return adapter.setAll(action.templateBasics, { ...state, loaded: true , added: true, adding: false});
    }
  ),
  on(TemplateBasicAction.loadMoreTempLateSuccess, (state, action) =>
    adapter.addMany(action.templateBasics, { ...state, loaded: true })),

  on(TemplateBasicAction.AddTemplateSuccess, (state, action) =>
    adapter.setOne(action.template, { ...state, loaded: true, added: true, adding: false })
  ),
  on(TemplateBasicAction.AddTemplate, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  ),
  on(TemplateBasicAction.updateTemplate, (state, _) => {
      return { ...state, adding: true, added: false };
    }
  )
);


export const { selectAll, selectTotal } = adapter.getSelectors();
