import {NzMessageService} from 'ng-zorro-antd/message';
import {PayrollStore} from './payroll.store';
import {PayrollService} from '../services/payroll.service';
import {Actions, Effect, ofType} from '@datorama/akita-ng-effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {PayrollActions} from './payroll.action';
import {AddPayrollDto} from '../dto';
import {Injectable} from '@angular/core';
import {
  AbsentSalaryEntity,
  AllowanceSalaryEntity,
  OvertimeSalaryEntity,
  RemoteSalaryEntity
} from "../../salary/entities";
import {TotalSalary} from "../entities";
import {DatetimeUnitEnum} from "@minhdu-fontend/enums";
import {PartialDayEnum} from "@minhdu-fontend/data-models";
import {PayrollQuery} from "./payroll.query";

@Injectable({providedIn: 'root'})
export class PayrollEffect {
  constructor(
    private readonly action$: Actions,
    private readonly service: PayrollService,
    private readonly message: NzMessageService,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery
  ) {
  }


  @Effect()
  addPayroll$ = this.action$.pipe(
    ofType(PayrollActions.addOne),
    switchMap((props: AddPayrollDto) => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }));
      return this.service.generate(props).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }));
          this.message.success(res.message);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, added: null
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect()
  loadAll$ = this.action$.pipe(
    ofType(PayrollActions.loadAll),
    switchMap((props) => {
      this.payrollStore.update(state => ({...state, loading: true}));
      return this.service.paginationPayroll(props.search).pipe(
        tap((res) => {
          this.payrollStore.update(state => ({...state, loading: false}));
          if (res.data.length === 0) {
            this.message.warning('Đã lấy hết phiếu lương');
          }
          if (props.isPaginate) {
            this.payrollStore.add(res.data);
          } else {
            this.payrollStore.set(res.data);
          }
        }),
        catchError((err) => {
          this.payrollStore.update(state => ({...state, loading: false}));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect()
  getOne$ = this.action$.pipe(
    ofType(PayrollActions.loadOne),
    switchMap(props => {
      return this.service.getOne(props).pipe(
        map(res => {

          res.totalAllowance = res.allowances?.length
            ? this.getTotalAllowance(res.allowances)
            : undefined

          res.totalOvertime = res.overtimes.length ?
            this.getTotalOvertimeOrAbsent(res.overtimes)
            : undefined

          res.totalAbsent = res.absents?.length
            ? this.getTotalOvertimeOrAbsent(res.absents)
            : undefined

          res.totalRemote = res.remotes?.length
            ? this.getTotalRemote(res.remotes)
            : undefined
          
          return res
        }),
        tap(res => {
          this.payrollStore.upsert(res.id, res);
        }),
        catchError(err => {
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect()
  update$ = this.action$.pipe(
    ofType(PayrollActions.update),
    switchMap(props => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }));
      return this.service.update(props).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }));
          this.payrollStore.update(res?.id, res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, added: null
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
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
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect()
  confirmPayroll$ = this.action$.pipe(
    ofType(PayrollActions.confirmPayroll),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }));
      return this.service.confirm(props).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }));
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect()
  scanHoliday$ = this.action$.pipe(
    ofType(PayrollActions.scanHoliday),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state, scanned: false
      }))
      return this.service.scanHoliday(props.payrollId).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, scanned: true
          }))
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  getTotalAllowance(salary: AllowanceSalaryEntity[]): TotalSalary {
    return salary.reduce((a, b) => {
      return {
        price: a.price + (b.price || 0),
        total: a.total + b.total,
        duration: {
          day: a.duration.day + b.duration,
        }
      }
    }, {price: 0, total: 0, duration: {day: 0}})
  }

  getTotalOvertimeOrAbsent(salary: (AbsentSalaryEntity | OvertimeSalaryEntity)[]): TotalSalary {
    return salary.reduce((a, b) => {
      const unit = b.setting?.unit
      return {
        price: a.price + (b.price || 0),
        total: a.total + b.total,
        duration: {
          day: a.duration.day + ((unit === DatetimeUnitEnum.DAY || unit === DatetimeUnitEnum.MONTH)
            ? (b.partial === PartialDayEnum.ALL_DAY ?
                b.duration
                : (b.duration / 2)
            )
            : 0),
          hour: a.duration.hour + (unit === DatetimeUnitEnum.MINUTE || unit === DatetimeUnitEnum.HOUR
            ? b.duration
            : 0)
        }
      }
    }, {price: 0, total: 0, duration: {day: 0, hour: 0}})
  }

  getTotalRemote(salary: RemoteSalaryEntity[]) {
    return salary.reduce((a, b) => {
      return {
        duration: a.duration + b.partial === PartialDayEnum.ALL_DAY ? b.duration : (b.duration / 2)
      }
    }, {duration: 0})
  }

}
