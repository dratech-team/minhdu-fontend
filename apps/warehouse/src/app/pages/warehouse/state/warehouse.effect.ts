import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { CategoryService } from '../services';
import { CategoryStore } from './category.store';
import { WarehouseAction } from './warehouse.action';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class WarehouseEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: CategoryService,
    private readonly warehouseStore: CategoryStore
  ) {
  }

  @Effect({ dispatch: false })
  loadWarehouses$ = this.action$.pipe(
    ofType(WarehouseAction.loadAll),
    switchMap(() => {
      return this.service.getAll();
    }),
    tap((data) => {
      this.warehouseStore.set(data);
    })
  );

  @Effect()
  addWarehouse$ = this.action$.pipe(
    ofType(WarehouseAction.addOne),
    switchMap((warehouse) => this.service.addOne(warehouse)),
    tap(warehouse => this.warehouseStore.add(warehouse))
  );
}
