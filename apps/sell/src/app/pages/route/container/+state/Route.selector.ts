import { RouteState } from './route.reducer';
import { Route } from './route.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FeatureName } from '@minhdu-fontend/constants';
import * as formRoute from './route.reducer'
import { selectorCommodityState } from '../../../commodity/+state/commodity.selector';
export interface state {
  route: RouteState
}

export const getSelectedRouteId = (state: Route) => state.id;
export const selectorRouteState = createFeatureSelector<RouteState>(
  FeatureName.ROUTE
);
export const selectorRouteEntities = createSelector(
  selectorRouteState,
  formRoute.selectEntities,
)
export const selectorAllRoute = createSelector(
  selectorRouteState,
  formRoute.selectAll,
)
export const selectorCurrentRoute =(id:number) => createSelector(
  selectorRouteEntities,
  (routeEntities) => routeEntities[id],
)
export const selectedLoaded = createSelector(
  selectorRouteState,
  (state) => state.loaded
)
