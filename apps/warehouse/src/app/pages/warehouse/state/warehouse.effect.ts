import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { WarehouseService } from '../services/warehouse.service';
import { WarehouseStore } from './warehouse.store';
import { WarehouseAction } from './warehouse.action';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class WarehouseEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: WarehouseService,
    private readonly warehouseStore: WarehouseStore
  ) {
  }

  @Effect({ dispatch: false })
  loadWarehouses$ = this.action$.pipe(
    ofType(WarehouseAction.loadWarehouses),
    switchMap(() => {
      return this.service.getAll();
    }),
    tap(data => {
      this.warehouseStore.set(data);
    })
  );


  @Effect({ dispatch: false })
  selectWarehouse$ = this.action$.pipe(
    ofType(WarehouseAction.selectedWarehouseId),
    tap((v) => this.warehouseStore.update(state => ({ ...state, selected: v.warehouseId })))
  );
}
