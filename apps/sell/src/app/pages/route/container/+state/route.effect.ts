import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouteAction } from './route.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RouteService } from '../../service/route.service';
import { throwError } from 'rxjs';

@Injectable()
export class RouteEffect {

  addRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.addRoute),
      switchMap((props) => this.routeService.addOne(props.route)),
      map((route) => RouteAction.loadInit({take:30, skip:0})),
      catchError((err) => throwError(err))
    ));
  loadInit$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.loadInit),
      switchMap((props) => this.routeService.pagination(props)),
      map((responsePagination) => RouteAction.loadInitSuccess({ routes: responsePagination.data })),
      catchError((err) => throwError(err))
    ));

  loadMoreRoutes$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.loadMoreRoutes),
      switchMap((props) => this.routeService.pagination(props)),
      map((responsePagination) => RouteAction.loadMoreRoutesSuccess({ routes: responsePagination.data })),
      catchError((err) => throwError(err))
    ));
  getRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.getRoute),
      switchMap((props) => this.routeService.getOne(props.id)),
      map((route) => RouteAction.getRouteSuccess({ route: route })),
      catchError((err) => throwError(err))
    ));

  updateRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.updateRoute),
      switchMap((props) => this.routeService.update(props.id, props.route).pipe(
        map(_ => RouteAction.getRoute({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    ));

  deleteRoute$ = createEffect(() =>
    this.action.pipe(
      ofType(RouteAction.deleteRoute),
      switchMap((props) => this.routeService.delete(props.id).pipe(
        map(_ => RouteAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    ));

  constructor(
    private readonly action: Actions,
    private readonly routeService: RouteService
  ) {
  }
}
