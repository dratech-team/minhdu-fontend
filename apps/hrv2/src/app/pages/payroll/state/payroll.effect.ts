import {NzMessageService} from "ng-zorro-antd/message";
import {PayrollStore} from "./payroll.store";
import {PayrollService} from "../services/payroll.service";
import {Actions, Effect, ofType} from "@datorama/akita-ng-effects";
import {catchError, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";
import {PayrollActions} from "./payroll.action";
import {AddPayrollDto} from "../dto";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class PayrollEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: PayrollService,
    private readonly message: NzMessageService,
    private readonly payrollStore: PayrollStore,
  ) {
  }

  @Effect()
  addPayroll$ = this.action$.pipe(
    ofType(PayrollActions.addOne),
    switchMap((props: AddPayrollDto) => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }))
      return this.service.addOne(props).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }))
          this.message.success('Thao tác thành công ');
          const params = {
            take: 30,
            skip: 0,
          }
          if (props.inHistory) {
            Object.assign(params, {employeeId: props.body.employeeId})
          }
          this.action$.dispatch(
            PayrollActions.loadAll({
                search: params
              }
            )
          );
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, added: null
          }))
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(PayrollActions.loadAll),
    switchMap((props) => {
      this.payrollStore.update(state => ({...state, loading: true}))
      return this.service.paginationPayroll(props.search).pipe(
        tap((res) => {
          this.payrollStore.update(state => ({...state, loading: false}))
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết phiếu lương')
          }
          if (props.isPaginate) {
            this.payrollStore.add(res.data);
          } else {
            this.payrollStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.payrollStore.update(state => ({...state, loading: false}))
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(PayrollActions.loadOne),
    switchMap(props => {
      return this.service.getOne(props).pipe(
        tap(res => {
          this.payrollStore.upsert(res.id, res);
        }),
        catchError(err => {
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(PayrollActions.update),
    switchMap(props => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }))
      return this.service.update(props).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }))
          this.payrollStore.update(res?.id, res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, added: null
          }))
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

  @Effect()
  remove$ = this.action$.pipe(
    ofType(PayrollActions.remove),
    switchMap((props) => {
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.payrollStore.remove(props.id);
        }),
        catchError(err => {
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

  @Effect()
  confirmPayroll$ = this.action$.pipe(
    ofType(PayrollActions.confirmPayroll),
    switchMap((props) => {
      return this.service.confirm(props).pipe(
        tap(res => {
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

  @Effect()
  scanHoliday$ = this.action$.pipe(
    ofType(PayrollActions.scanHoliday),
    switchMap((props) => {
      return this.service.scanHoliday(props.payrollId).pipe(
        tap(res => {
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          return of(PayrollActions.error(err))
        })
      );
    }),
  );

}
