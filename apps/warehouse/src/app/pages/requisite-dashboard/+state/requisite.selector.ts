import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formRequisite from './requisite.reducer';
import { RequisiteState } from './requisite.reducer';
import { Requisite } from './requisite .interface';

export interface state {
  customer: RequisiteState,
}

export const getSelectedRequisiteId = (state: Requisite) => state.id;
export const selectorRequisiteState = createFeatureSelector<RequisiteState>(
  FeatureName.REQUISITE
);
export const selectorRequisiteEntities = createSelector(
  selectorRequisiteState,
  formRequisite.selectEntities
);

export const selectorAllRequisite = createSelector(
  selectorRequisiteState,
  formRequisite.selectAll
);

export const selectorCurrentRequisite = (id: number) => createSelector(
  selectorRequisiteEntities,
  (RequisiteEntities) => {
    return RequisiteEntities[id]
  }
);

export const selectedLoaded = createSelector(
  selectorRequisiteState,
  (state) => state.loaded
);


