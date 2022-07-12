import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DistrictAction } from './district.action';
import { DistrictService } from '../../service/district..service';

@Injectable()
export class DistrictEffect {
  loadDistricts$ = createEffect(() =>
    this.action.pipe(
      ofType(DistrictAction.loadAllDistricts),
      switchMap((_) => this.DistrictService.getAll()),
      map((props) =>
        DistrictAction.loadAllDistrictsSuccess({ districts: props })
      ),
      catchError((err) => throwError(err))
    )
  );

  getDistrict$ = createEffect(() =>
    this.action.pipe(
      ofType(DistrictAction.getDistrict),
      switchMap((props) => this.DistrictService.getOne(props.idDistrict)),
      map((props) => DistrictAction.getDistrictSuccess({ district: props })),
      catchError((err) => throwError(err))
    )
  );

  getDistrictsByProvinceId$ = createEffect(() =>
    this.action.pipe(
      ofType(DistrictAction.getDistrictsByProvinceId),
      switchMap((props) => this.DistrictService.getAll(props)),
      map((props) =>
        DistrictAction.getDistrictsByProvinceIdSuccess({ districts: props })
      ),
      catchError((err) => throwError(err))
    )
  );

  constructor(
    private readonly action: Actions,
    private readonly DistrictService: DistrictService
  ) {}
}
