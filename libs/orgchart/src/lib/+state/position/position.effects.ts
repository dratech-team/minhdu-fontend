import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PositionActions } from './position.actions';
import { PositionService } from '@minhdu-fontend/orgchart';
import { OrgchartActions } from '@minhdu-fontend/orgchart';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class PositionEffects {
  loadAllPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.loadPosition),
      mergeMap((prams) => this.positionService.getAll(prams)),
      map(position => {
          return PositionActions.loadPositionSuccess({ position });
        }
      ),
      catchError(err => throwError(err))
    )
  );

  searchPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.searchPosition),
      mergeMap((props) => this.positionService.getAll(props)),
      map(position => {
        return PositionActions.loadPositionSuccess({ position });
      }),
      catchError(err => throwError(err))
    )
  );

  addPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.addPosition),
      switchMap(param => this.positionService.addOne(param).pipe(
        map(res => {
          /*if (param.branchId) {
            this.store.dispatch(OrgchartActions.getBranch({id: param.branchId}))
          }*/
          return res;
        })
      )),
      map(position => {
        this.message.success('Tạo mới chức vụ thành công');
        return PositionActions.addPositionSuccess({ position });
      }),
      catchError(err => throwError(err))
    )
  );


  updatePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.updatePosition),
      switchMap(param => this.positionService.update(param.id,
        { name: param.name, workday: param.workday, branchesId: param.branchIds }).pipe(
        map(position => {
          this.message.success('Cập nhật chức vụ thành công');
          return PositionActions.updatePositionSuccess({ position });
          /*return OrgchartActions.getBranch({id: param.branchId})*/
        })
      )),
      catchError(err => throwError(err))
    )
  );

  deletePosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PositionActions.deletePosition),
      switchMap(param => this.positionService.delete(param.id).pipe(
        map(_ => {
            this.message.success('Xóa chức vụ thành công');
            if (param.branchId) {
              return OrgchartActions.getBranch({ id: param.branchId });
            } else {
              return PositionActions.loadPosition();
            }
          }
        ),
        catchError(err => throwError(err))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private message: NzMessageService,
    private positionService: PositionService
  ) {
  }
}
