import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as TemplateSalary from '../teamlate-salary/template-salary.reducer';
import { templateSalaryState } from './template-salary.reducer';

export interface state {
  templateBasic: templateSalaryState;
}

export const selectorTemplateState = createFeatureSelector<templateSalaryState>(
  FeatureName.TEMPLATE_SALARY
);

export const selectorAllTemplate = createSelector(
  selectorTemplateState,
  TemplateSalary.selectAll
);
export const selectorTemplateTotal = createSelector(
  selectorTemplateState,
  TemplateSalary.selectTotal
);
export const selectTemplateLoaded = createSelector(
  selectorTemplateState,
  (state) => {
    return state.loaded;
  }
);
export const selectTemplateAdded = createSelector(
  selectorTemplateState,
  (state) => {
    return state.added;
  }
);
export const selectTemplateAdding = createSelector(
  selectorTemplateState,
  (state) => {
    return state.adding;
  }
);
