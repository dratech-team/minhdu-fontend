import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NationAction } from './nation.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NationService } from '../../service/nation.service';
import { throwError } from 'rxjs';

@Injectable()
export class NationEffect {
  loadNations$ = createEffect(()=>
  this.action.pipe(
    ofType(NationAction.loadAllNation),
    switchMap(_ => this.nationService.getAll()),
    map((props) => NationAction.loadAllNationsSuccess({nations :props})),
    catchError(err=> throwError(err))
  ))
  getNation$ = createEffect(()=>
    this.action.pipe(
      ofType(NationAction.getNation),
      switchMap(props => this.nationService.getOne(props.idNation)),
      map((props) => NationAction.getNationSuccess({nation :props})),
      catchError(err=> throwError(err))
    ))

  constructor(
    private  readonly action : Actions,
    private  readonly nationService : NationService,
  ) {
  }
}
