import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as OrgchartActions from './orgchart.actions';
import { Branch } from '@minhdu-fontend/data-models';


export const ORGCHART_FEATURE_KEY = 'orgchart';

export interface State extends EntityState<Branch> {
  selectedId?: string | number; // which Orgchart record has been selected
  loaded: boolean; // has the Orgchart list been loaded
  error?: string | null; // last known error (if any)
}

export interface OrgchartPartialState {
  readonly [ORGCHART_FEATURE_KEY]: State;
}

export const orgchartAdapter: EntityAdapter<Branch> = createEntityAdapter<Branch>();

export const initialState: State = orgchartAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const orgchartReducer = createReducer(
  initialState,
  on(OrgchartActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(OrgchartActions.loadOrgchartSuccess, (state, { branches }) =>
    orgchartAdapter.setAll(branches, { ...state, loaded: true })
  ),
  on(OrgchartActions.loadOrgchartFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return orgchartReducer(state, action);
}
