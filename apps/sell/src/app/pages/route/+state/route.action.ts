import {UpdateNum} from "@ngrx/entity/src/models";
import {AddRouteDto} from "../dto/add-route.dto";
import {createAction, props} from "@datorama/akita-ng-effects";
import {RouteEntity} from "../entities/route.entity";
import {UpdateRouteDto} from "../dto/update-route.dto";

export const addOne = createAction(
  '[ROUTE] Add One',
  props<AddRouteDto>()
);

export const loadInit = createAction(
  '[LOAD_ROUTES] Load Route',
  props<{
    take: number;
    skip: number;
    orderId?: number;
    name?: string;
    startedAt?: Date;
    endedAt?: Date;
    driver?: string;
    bsx?: string;
    garage?: string;
  }>()
);

export const loadInitSuccess = createAction(
  '[LOAD_ROUTES] Load Route Success',
  props<{ routes: RouteEntity[] }>()
);

export const loadMoreRoutes = createAction(
  '[LOAD_MORE_ROUTES] Load More Order',
  props<{
    take: number;
    orderId?: number;
    name?: string;
    startedAt?: Date;
    endedAt?: Date;
    driver?: string;
    bsx?: string;
    garage?: string;
  }>()
);

export const loadMoreRoutesSuccess = createAction(
  '[LOAD_MORE_ROUTES] Load More Routes success',
  props<{ routes: RouteEntity[] }>()
);

export const getRoute = createAction(
  '[GET_ROUTE] get route',
  props<{ id: number }>()
);

export const getRouteSuccess = createAction(
  '[GET_ROUTE] Get route Success',
  props<{ route: RouteEntity }>()
);

export const updateRoute = createAction(
  '[UPDATE_ROUTE] Update Route',
  props<{ id: number; updateRouteDto: Partial<UpdateRouteDto> }>()
);

export const updateRouteSuccess = createAction(
  '[UPDATE_ROUTE] Update Route Success',
  props<{ route: UpdateNum<RouteEntity> }>()
);

export const deleteRoute = createAction(
  '[DELETE_ROUTE] Delete Route',
  props<{ idRoute: number }>()
);

export const RouteAction = {
  addOne,
  loadInit,
  loadInitSuccess,
  loadMoreRoutes,
  loadMoreRoutesSuccess,
  getRoute,
  getRouteSuccess,
  updateRoute,
  deleteRoute,
  updateRouteSuccess
};
