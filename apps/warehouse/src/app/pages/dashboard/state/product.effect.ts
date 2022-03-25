import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductActions } from './productActions';
import { ProductStore } from './product.store';
import { ProductService } from '../services/product.service';

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
    ofType(ProductActions.loadAll),
    switchMap((props) => {
      this.productStore.update(state=> ({...state, loading: true}))
      return this.service.pagination(props);
    }),
    tap((data) => {
      this.productStore.update(state=> ({...state, loading: false}))
      this.productStore.set(data.data);
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  addProduct$ = this.action$.pipe(
    ofType(ProductActions.addOne),
    switchMap(product => {
      if (product.product?.branch === 'Kho tổng') {
        return this.service.addOne(Object.assign(product.product, { branch: null }));
      }
      return this.service.addOne(product.product);
    }),
    tap(data => {

      this.productStore.upsert(data?.id, data);
    })
  );
}
