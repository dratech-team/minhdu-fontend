import { templateOvertimeState } from './template-overtime.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as fromTemplateOvertime from '../template-overtime/template-overtime.reducer';

export interface state {
  templateOvertime: templateOvertimeState;
}

export const selectorTemplateState = createFeatureSelector<templateOvertimeState>(
  FeatureName.TEMPLATE_OVERTIME
);

export const selectorAllTemplate = createSelector(
  selectorTemplateState,
  fromTemplateOvertime.selectAll
);
export const selectorTemplateTotal = createSelector(
  selectorTemplateState,
  fromTemplateOvertime.selectTotal
);
