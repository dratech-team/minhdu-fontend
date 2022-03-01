import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CommodityService } from '../service/commodity.service';
import { CommodityActions } from './commodity.actions';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommodityStore } from './commodity.store';
import { CommodityQuery } from './commodity.query';
import { Commodity } from '../entities/commodity.entity';

@Injectable()
export class CommodityEffect {
  constructor(
    private readonly actions$: Actions,
    private readonly store: CommodityStore,
    private readonly query: CommodityQuery,
    private readonly snackbar: MatSnackBar,
    private readonly commodityService: CommodityService
  ) {
  }

  @Effect()
  addOne$ = this.actions$.pipe(
    ofType(CommodityActions.addOne),
    switchMap((props) => this.commodityService.addOne(props)),
    tap(commodity => {
        this.store.add(commodity);
        this.snackbar.open('Thêm hàng hóa thành công', '', { duration: 1500 });
      }
    ),
    catchError((err) => throwError(err))
  );

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(CommodityActions.loadAll),
    switchMap(() => this.commodityService.pagination()),
    tap((response) => this.store.add(response.data)),
    catchError((err) => throwError(err))
  );

  @Effect()
  getOne$ = this.actions$.pipe(
    ofType(CommodityActions.getOne),
    switchMap((props) => this.commodityService.getOne(props.id)),
    tap((commodity) => this.store.update(commodity.id, commodity)),
    catchError((err) => throwError(err))
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(CommodityActions.update),
    switchMap((props) => this.commodityService.update(props.id, props.updates)),
    tap((response) => this.store.update(response.id, response.changes)),
    catchError((err) => throwError(err))
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType(CommodityActions.remove),
    switchMap((props) => this.commodityService.delete(props.id)),
    map((commodity) => {
        this.snackbar.open('Xóa hàng hóa thành công', '', { duration: 1500 });
        this.store.remove((commodity as Commodity).id);
      }
    ),
    catchError((err) => throwError(err))
  );
}
