
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WarehouseAction } from './warehouse.action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WarehouseService } from '../../service/warehouse.service';
import { throwError } from 'rxjs';

@Injectable()
export class WarehouseEffect {
    LoadInit$ = createEffect(()=>
    this.action.pipe(
      ofType(WarehouseAction.LoadInit),
      switchMap((props) => this.wareHouseService.getAll()),
      map((warehouses) => {
        console.log('here')
        return  WarehouseAction.LoadInitSuccess({warehouses: warehouses})}

       ),
      catchError(err => throwError(err))
    ))
  getOne$ = createEffect(()=>
    this.action.pipe(
      ofType(WarehouseAction.getOneWarehouse),
      switchMap((props) => this.wareHouseService.getOne(props.warehouseId)),
      map((warehouse) => WarehouseAction.getOneWarehouseSuccess({warehouse: warehouse})),
      catchError(err => throwError(err))
    ))
  update$ = createEffect(()=>
    this.action.pipe(
      ofType(WarehouseAction.updateWarehouse),
      switchMap((props) => this.wareHouseService.update(props.id, props.warehouse)),
      map(_ => WarehouseAction.LoadInit()),
      catchError(err => throwError(err))
    ))
  delete$ = createEffect(()=>
    this.action.pipe(
      ofType(WarehouseAction.deleteWarehouse),
      switchMap((props) => this.wareHouseService.delete(props.id)),
      map(_=> WarehouseAction.LoadInit()),
      catchError(err => throwError(err))
    ))
  constructor(
    private readonly action: Actions,
    private readonly wareHouseService: WarehouseService,
  ) {
  }
}

