import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromTemplateBasic from '../teamlate-salary-basic/template-basic-salary.reducer';
import { templateBasicState } from './template-basic-salary.reducer';

export interface state {
  templateBasic: templateBasicState;
}

export const selectorTemplateState = createFeatureSelector<templateBasicState>(
  FeatureName.TEMPLATE_BASIC
);

export const selectorAllTemplate = createSelector(
  selectorTemplateState,
  fromTemplateBasic.selectAll
);
export const selectorTemplateTotal = createSelector(
  selectorTemplateState,
  fromTemplateBasic.selectTotal
);
export const selectTemplateLoaded = createSelector(
  selectorTemplateState,
  (state) => {
    return state.loaded;
  }
);
