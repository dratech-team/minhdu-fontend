import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProvinceAction } from './nation.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProvinceService } from '@minhdu-fontend/location';

@Injectable()
export class ProvinceEffect {
  loadProvinces$ = createEffect(() =>
    this.action.pipe(
      ofType(ProvinceAction.loadAllProvinces),
      switchMap((_) => {
        return this.provinceService.getAll();
      }),
      map((props) => {
        return ProvinceAction.loadAllProvincesSuccess({ provinces: props });
      }),
      catchError((err) => throwError(err))
    )
  );
  getProvince$ = createEffect(() =>
    this.action.pipe(
      ofType(ProvinceAction.getProvince),
      switchMap((props) => this.provinceService.getOne(props.idProvince)),
      map((props) => ProvinceAction.getProvinceSuccess({ province: props })),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly action: Actions,
    private readonly provinceService: ProvinceService
  ) {
  }
}
