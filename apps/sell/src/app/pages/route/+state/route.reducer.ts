import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Route } from './route.interface';
import { createReducer, on } from '@ngrx/store';
import { RouteAction } from './route.action';


export interface RouteState extends EntityState<Route> {
  loaded: boolean,
  selectedRouteId: number,
}

export const adapter: EntityAdapter<Route> = createEntityAdapter<Route>();
export const initialRoute = adapter.getInitialState({ loaded: false });
export const RouteReducer = createReducer(
  initialRoute,
  on(RouteAction.loadInitSuccess, (state, action) =>
    adapter.setAll(action.routes, { ...state, loaded: true })
  ),
  on(RouteAction.loadMoreRoutesSuccess, (state, action) =>
    adapter.addMany(action.routes, { ...state, loaded: true })
  ),
  on(RouteAction.getRouteSuccess, (state, action) =>
    adapter.upsertOne(action.route, { ...state, loaded: true })
  )
);
export const {
  selectAll,
  selectEntities,
  selectTotal,
} = adapter.getSelectors()
