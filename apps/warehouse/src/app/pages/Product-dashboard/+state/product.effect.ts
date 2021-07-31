import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductAction } from './product.action';
import { ProductService } from '../service/product.service';
@Injectable()
export class ProductEffect {

  loadProducts$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProductAction.loadInit),
      switchMap((props) => {
        return this.productService.pagination(props);
      }),
      map((ResponsePaginate) => ProductAction.loadInitSuccess({
        product: ResponsePaginate.data
      })),
      catchError((err) => throwError(err))
    )
  );
  loadMoreProducts$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProductAction.loadMoreProducts),
      switchMap((props) => this.productService.pagination(props)),
      map((ResponsePaginate) =>
        ProductAction.loadMoreProductsSuccess({ product: ResponsePaginate.data })),
      catchError((err) => throwError(err))
    )
  );

  addProduct$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProductAction.addProduct),
      switchMap((props) => this.productService.addOne(props.product).pipe(
        map(() => ProductAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  getProduct$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProductAction.getProduct),
      switchMap((props) => this.productService.getOne(props.id)),
      map((poultryFood) => ProductAction.getProductSuccess({ product: poultryFood })),
      catchError((err) => throwError(err))
    )
  );

  updateProduct$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProductAction.updateProduct),
      switchMap((props) => this.productService.update(props.id, props.product).pipe(
        map(() => ProductAction.getProduct({ id: props.id })),
        catchError((err) => throwError(err))
      ))
    )
  );


  deleteProduct$ = createEffect(() =>
    this.action$.pipe(
      ofType(ProductAction.deleteProduct),
      switchMap((props) => this.productService.delete(props.productId).pipe(
        map(() => ProductAction.loadInit({ take: 30, skip: 0 })),
        catchError((err) => throwError(err))
      ))
    )
  );

  constructor(
    private readonly action$: Actions,
    private readonly productService: ProductService
  ) {
  }
}
