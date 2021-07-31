import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PoultryFoodAction } from './poultry-food.action';
import { PoultryFoodService } from '../service/poultry-food.service';
@Injectable()
export class PoultryFoodEffect {

  loadPoultryFoods$ = createEffect(() =>
    this.action$.pipe(
      ofType(PoultryFoodAction.loadInit),
      switchMap((props) => {
        return this.poultryFoodService.pagination(props);
      }),
      map((ResponsePaginate) => PoultryFoodAction.loadInitSuccess({
        poultryFoods: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMorePoultryFoods$ = createEffect(() =>
    this.action$.pipe(
      ofType(PoultryFoodAction.loadMorePoultryFoods),
      switchMap((props) => this.poultryFoodService.pagination(props)),
      map((ResponsePaginate) =>
        PoultryFoodAction.loadMorePoultryFoodsSuccess({ poultryFood: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addPoultryFood$ = createEffect(() =>
    this.action$.pipe(
      ofType(PoultryFoodAction.addPoultryFood),
      switchMap((props) => this.poultryFoodService.addOne(props.poultryFood).pipe(
        map(() => PoultryFoodAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getPoultryFood$ = createEffect(() =>
    this.action$.pipe(
      ofType(PoultryFoodAction.getPoultryFood),
      switchMap((props) => this.poultryFoodService.getOne(props.id)),
      map((poultryFood) => PoultryFoodAction.getPoultryFoodSuccess({ poultryFood: poultryFood })),
      catchError((err) => throwError(err))
    )
  );

  updatePoultryFood$ = createEffect(() =>
    this.action$.pipe(
      ofType(PoultryFoodAction.updatePoultryFood),
      switchMap((props) => this.poultryFoodService.update(props.id, props.poultryFood).pipe(
        map(() => PoultryFoodAction.getPoultryFood({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deletePoultryFood$ = createEffect(() =>
    this.action$.pipe(
      ofType(PoultryFoodAction.deletePoultryFood),
      switchMap((props) => this.poultryFoodService.delete(props.poultryFoodId).pipe(
        map(() => PoultryFoodAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly poultryFoodService: PoultryFoodService
  ) {
  }
}
