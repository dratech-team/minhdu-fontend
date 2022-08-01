import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { StockActions } from './stock.actions';
import { StockStore } from './stock.store';
import { StockService } from '../services';

@Injectable()
export class StockEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: StockService,
    private readonly stockStore: StockStore
  ) {
  }

  @Effect()
  addOne$ = this.action$.pipe(
    ofType(StockActions.addOne),
    switchMap((props) => {
      this.stockStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.addOne(props).pipe(
        tap((res) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.stockStore.upsert(res.id, res);
        }),
        catchError((err) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(StockActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(StockActions.loadAll),
    switchMap((props) => {
      this.stockStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.pagination(props).pipe(
        tap((res) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: false
          }));
          if (props.isSet) {
            this.stockStore.set(res.data);
          } else {
            this.stockStore.add(res.data);
          }
        }),
        catchError((err) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(StockActions.error(err));
        })
      );
    })
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(StockActions.getOne),
    switchMap((props) => {
      return this.service.getOne(props.id).pipe(
        tap((res) => {
          this.stockStore.update(res?.id, res);
        }),
        catchError((err) => {
          return of(StockActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(StockActions.update),
    switchMap((props) => {
      this.stockStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.update(props).pipe(
        tap((res) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.stockStore.update(res?.id, res);
        }),
        catchError((err) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(StockActions.error(err));
        })
      );
    })
  );

  @Effect()
  delete$ = this.action$.pipe(
    ofType(StockActions.remove),
    switchMap((props) => {
      this.stockStore.update((state) => ({
        ...state,
        loading: true
      }));
      return this.service.delete(props.id).pipe(
        tap((_) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: false
          }));
          this.stockStore.remove(props?.id);
        }),
        catchError((err) => {
          this.stockStore.update((state) => ({
            ...state,
            loading: undefined
          }));
          return of(StockActions.error(err));
        })
      );
    })
  );
}
