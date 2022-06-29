import { NationState } from './nation.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import { Nation } from '@minhdu-fontend/data-models';
import * as fromNation from './nation.reducer';

export const SelectorNationState = createFeatureSelector<NationState>(
  FeatureName.NATION
);
export const getSelectedNationId = (state: Nation) => state.id;
export const selectAllNation = createSelector(
  SelectorNationState,
  fromNation.selectAll
);
export const selectorEntities = createSelector(
  SelectorNationState,
  fromNation.selectEntities
);
export const selectNationById = (id: number) =>
  createSelector(selectorEntities, (nationEntities) => {
    return nationEntities[id];
  });
export const selectedLoaded = createSelector(
  SelectorNationState,
  (state) => state.loaded
);
