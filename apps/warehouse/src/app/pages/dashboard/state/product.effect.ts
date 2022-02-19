import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductAction } from './product.action';
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
    ofType(ProductAction.loadProduct),
    switchMap((props) => {
      return this.service.pagination(props.search);
    }),
    tap((data) => {
      console.log(data);
      this.productStore.set(data.data);
    }),
    catchError((err) => throwError(err))
  );

  @Effect()
  addProduct$ = this.action$.pipe(
    ofType(ProductAction.addProduct),
    switchMap(product => this.service.addOne(product.product)),
    tap(data => {

      this.productStore.upsert(data?.id, data);
    })
  );
}
