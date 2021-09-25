import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { TemplateBasicSalary } from './template-basic-salary';
import { TemplateBasicAction } from './template-basic-salary.action';


export interface templateBasicState extends EntityState<TemplateBasicSalary> {
  loaded: boolean,
}

export const adapter: EntityAdapter<TemplateBasicSalary> = createEntityAdapter<TemplateBasicSalary>();

export const initialTemplateBasic = adapter.getInitialState({ loaded: false });

export const templateBasicReducer = createReducer(
  initialTemplateBasic,
  on(TemplateBasicAction.loadInitTempLateSuccess, (state, action) =>
  {
    return  adapter.setAll(action.templateBasics, { ...state, loaded: true })
  }
   ),
  on(TemplateBasicAction.loadMoreTempLateSuccess, (state, action) =>
    adapter.addMany(action.templateBasics, { ...state, loaded: true })),
  on(TemplateBasicAction.AddTemplateSuccess, (state, action) =>
    adapter.setOne(action.template, { ...state, loaded: true })
  )
);

export const { selectAll, selectTotal } = adapter.getSelectors();
