import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {SalaryActions} from './salary.actions';
import {SalaryService} from '../service';
import {SalaryQuery} from './salary.query';
import {SalaryStore} from './salary.store';
import {AddSalaryDto} from '../dto';
import {NzMessageService} from 'ng-zorro-antd/message';

@Injectable()
export class SalaryEffect {
  constructor(
    private readonly action$: Actions,
    private readonly salaryStore: SalaryStore,
    private readonly salaryQuery: SalaryQuery,
    private readonly salaryService: SalaryService,
    private readonly message: NzMessageService,
  ) {
  }


  @Effect()
  addOne$ = this.action$.pipe(
    ofType(SalaryActions.addOne),
    switchMap((props: AddSalaryDto) => {
      this.salaryStore.update(state => ({
        ...state, added: false
      }));
      return this.salaryService.addOne(props).pipe(
        tap((res) => {
          this.message.success('Thêm thành công')
            this.salaryStore.update(state => ({
              ...state, added: true
            }));
            this.salaryStore.add(res);
          }
        ),
        catchError(err => {
          this.salaryStore.update(state => ({
            ...state, added: null
          }));
          return of(SalaryActions.error(err))
        }),
      );
    }),
  );


  @Effect()
  updateSalary$ = this.action$.pipe(
    ofType(SalaryActions.update),
    switchMap((props) => {
        this.salaryStore.update(state => ({
          ...state, added: false
        }));
        return this.salaryService.update(props).pipe(
          tap(response => {
            this.salaryStore.update(state => ({
              ...state, added: true
            }));
            this.salaryStore.update(response.id, response);
          }),
          catchError(err =>{
              this.salaryStore.update(state => ({
                ...state, added: null
              }));
            return of(SalaryActions.error(err))
          }
            )
        );
      }
    )
  );

  @Effect()
  deleteSalary = this.action$.pipe(
    ofType(SalaryActions.remove),
    switchMap((props) => this.salaryService.delete(props.id).pipe(
      map(() =>{
        this.message.success('Xoá thành công')
        return  this.salaryStore.remove(props.id)
      }
       ),
      catchError((err) => of(SalaryActions.error(err)))
    ))
  );

}
