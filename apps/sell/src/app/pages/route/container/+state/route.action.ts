import { createAction, props } from '@ngrx/store';
import { Route } from './route.interface';

export const addRoute = createAction(
  '[ADD_ROUTE] Add Route',
  props<{ route: any }>()
);

export const addRouteSuccess = createAction(
  '[ADD_ROUTE] Add Route Success',
  props<{ route: Route }>()
);

export const loadInit = createAction(
  '[LOAD_ROUTES] Load Route',
  props<{ take: number, skip: number, orderId?: number }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_ROUTES] Load Route Success',
  props<{ routes: Route[] }>()
);

export const loadMoreRoutes = createAction(
  '[LOAD_MORE_ROUTES] Load More Order',
  props<{ take: number, skip: number,orderId?: number }>()
);

export const loadMoreRoutesSuccess = createAction(
  '[LOAD_MORE_ROUTES] Load More Routes success',
  props<{ routes: Route[] }>()
);

export const getRoute = createAction(
  '[GET_ROUTE] get route',
  props<{ id: number }>()
);

export const getRouteSuccess = createAction(
  '[GET_ROUTE] Get route Success',
  props<{ route: Route }>()
);

export const updateRoute = createAction(
  '[UPDATE_ROUTE] Update Route',
  props<{ route: any, id: number }>()
);

export const deleteRoute = createAction(
  '[DELETE_ROUTE] Delete Route',
  props<{ idRoute: number }>()
);

export const RouteAction = {
  addRoute,
  addRouteSuccess,
  loadInit,
  loadInitSuccess,
  loadMoreRoutes,
  loadMoreRoutesSuccess,
  getRoute,
  getRouteSuccess,
  updateRoute,
  deleteRoute
};
