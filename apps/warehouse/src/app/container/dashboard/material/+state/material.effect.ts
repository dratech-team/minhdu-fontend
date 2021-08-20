import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MaterialAction } from './material.action';
import { MaterialService } from '../service/material.service';

@Injectable()
export class MaterialEffect {

  loadMaterials$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.loadInit),
      switchMap((props) => {
        return this.applianceService.pagination(props);
      }),
      map((ResponsePaginate) => MaterialAction.loadInitSuccess({
        materials: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreMaterials$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.loadMoreMaterials),
      switchMap((props) => this.applianceService.pagination(props)),
      map((ResponsePaginate) =>
        MaterialAction.loadMoreMaterialsSuccess({ materials: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addMaterial$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.addMaterial),
      switchMap((props) => this.applianceService.addOne(props.material).pipe(
        map(() => MaterialAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getMaterial$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.getMaterial),
      switchMap((props) => this.applianceService.getOne(props.id)),
      map((Material) => MaterialAction.getMaterialSuccess({ material: Material })),
      catchError((err) => throwError(err))
    )
  );

  updateMaterial$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.updateMaterial),
      switchMap((props) => this.applianceService.update(props.id, props.material).pipe(
        map(() => MaterialAction.getMaterial({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteMaterial$ = createEffect(() =>
    this.action$.pipe(
      ofType(MaterialAction.deleteMaterial),
      switchMap((props) => this.applianceService.delete(props.materialId).pipe(
        map(() => MaterialAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly applianceService: MaterialService
  ) {
  }
}
