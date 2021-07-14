import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { WardAction } from './ward.action';
import { WardService } from '../../service/ward.service';

@Injectable()
export class WardEffect {
  loadWards$ = createEffect(() =>
    this.action.pipe(
      ofType(WardAction.loadAllWards),
      switchMap(_ => this.WardService.getAll()),
      map((props) => WardAction.loadAllWardsSuccess({ wards: props })),
      catchError(err => throwError(err))
    ));
  getWard$ = createEffect(() =>
    this.action.pipe(
      ofType(WardAction.getWard),
      switchMap(props => this.WardService.getOne(props.idWard)),
      map((props) => WardAction.getWardSuccess({ ward: props })),
      catchError(err => throwError(err))
    ));

  constructor(
    private readonly action: Actions,
    private readonly WardService: WardService
  ) {
  }
}
