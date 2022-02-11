import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductAction } from './product.action';
import { ProductStore } from './product.store';
import { ProductService } from '../../services/product.service';

@Injectable()
export class ProductEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: ProductService,
    private readonly productStore: ProductStore
  ) {
  }

  @Effect()
  loadProducts$ = this.action$.pipe(
    ofType(ProductAction.loadProduct),
    switchMap((props) => {
      return this.service.pagination(props);
    }),
    tap((data) => {
      this.productStore.set(data.data);
      // this.productStore.update((state) => ({ ...state, loading: false }));
    }),
    catchError((err) => throwError(err))
  );

  @Effect({ dispatch: false })
  selectWarehouse$ = this.action$.pipe(
    ofType(ProductAction.selectWarehouse),
    tap((({ warehouse }) => this.productStore.update(state => ({ ...state, warehouseSelected: warehouse }))))
  );
}
