import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as OrgchartActions from './orgchart.actions';
import { Branch } from '@minhdu-fontend/data-models';


export const ORGCHART_FEATURE_KEY = 'orgchart';

export interface State extends EntityState<Branch> {
  selectedId?: string | number; // which branch record has been selected
  loaded: boolean; // has the branch list been loaded
  added: boolean;
  error?: string | null; // last known error (if any)
}


export interface OrgchartPartialState {
  readonly [ORGCHART_FEATURE_KEY]: State;
}

export const orgchartAdapter: EntityAdapter<Branch> = createEntityAdapter<Branch>();

export const initialState: State = orgchartAdapter.getInitialState({
  loaded: false, added: false
});
const orgchartReducer = createReducer(
  initialState,
  on(OrgchartActions.loadOrgchartSuccess, (state, { branches }) =>
    orgchartAdapter.setAll(branches, { ...state, loaded: true, added: true })
  ),

  on(OrgchartActions.addBranchSuccess, (state, { branch }) =>
    orgchartAdapter.addOne(branch, { ...state, loaded: true, added: true })
  ),

  on(OrgchartActions.updateBranchSuccess, (state, { branch }) => {
      return orgchartAdapter.updateOne({ id:branch.id, changes: branch },
        { ...state, added: true });
    }
  ),

  on(OrgchartActions.getBranch, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(OrgchartActions.getBranchSuccess, (state, action) =>
    orgchartAdapter.upsertOne(action.branch, { ...state, loaded: true, added: true })
  ),
  on(OrgchartActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(OrgchartActions.searchBranch, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(OrgchartActions.addBranch, (state) => ({
    ...state,
    added: false,
    error: null
  })),

  on(OrgchartActions.updateBranch, (state) => ({
    ...state,
    added: false,
    error: null
  })),
  on(OrgchartActions.loadOrgchartFailure, (state, { error }) => ({
    ...state,
    error
  }))
  )
;

export function reducer(state: State | undefined, action: Action) {
  return orgchartReducer(state, action);
}
