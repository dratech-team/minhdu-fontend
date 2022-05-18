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
  RemoteSalaryEntity, SalaryEntity
} from '../../salary/entities';
import {PayrollEntity, TotalSalary} from '../entities';
import {DatetimeUnitEnum, SalaryTypeEnum} from '@minhdu-fontend/enums';
import {PartialDayEnum} from '@minhdu-fontend/data-models';
import {StateHistoryPlugin} from '@datorama/akita';
import {PayrollQuery} from './payroll.query';
import {PaginationDto} from "@minhdu-fontend/constants";
import {DayOffSalaryEntity} from "../../salary/entities";
import {AddManyPayrollDto} from "../dto/add-many-payroll.dto";
import {HolidaySalaryEntity} from "../../salary/entities/holiday-salary.entity";
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class PayrollEffect {
  private stateHistory: StateHistoryPlugin;

  constructor(
    private readonly action$: Actions,
    private readonly service: PayrollService,
    private readonly message: NzMessageService,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery
  ) {
    this.stateHistory = new StateHistoryPlugin(this.payrollQuery);
  }


  @Effect()
  addOne$ = this.action$.pipe(
    ofType(PayrollActions.addOne),
    switchMap((props: AddPayrollDto) => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }));
      return this.service.addOne(props).pipe(
        tap(res => {
          console.log(res)
          this.payrollStore.update(state => ({
            ...state, added: true
          }));
          this.message.success('Thêm phiếu lương thành công')
          this.payrollStore.add(res)
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
  addMany$ = this.action$.pipe(
    ofType(PayrollActions.addMany),
    switchMap((props: AddManyPayrollDto) => {
      this.payrollStore.update(state => ({
        ...state, added: false
      }));
      return this.service.addMany(props).pipe(
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
      this.payrollStore.update(state => (
        Object.assign({...state}, props.isPaginate
          ? {loadMore: true}
          : {loading: true}
        )
      ));
      Object.assign(props.search,
        {
          take: PaginationDto.take,
          skip: props.isPaginate ? this.payrollQuery.getCount() : PaginationDto.skip
        }
      )
      return this.service.paginationPayroll(props.search).pipe(
        map(res => {
          return Object.assign(res, {
            data: res.data.map(payroll => Object.assign(payroll, {
              expand: this.payrollStore.getValue().expandAll,
              basics: payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.BASIC || item.type === SalaryTypeEnum.BASIC_INSURANCE),
              stays: payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.STAY)
            }))
          });
        }),
        tap((res) => {
          this.payrollStore.update(state => (
            Object.assign({...state, total: res.total, totalSalary: res.total2}, props.isPaginate
              ? {loadMore: false}
              : {loading: false}
            )
          ));
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
          return this.mapToPayroll(res);
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
        map(res => this.mapToPayroll(res)),
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, added: true
          }));
          this.payrollStore.update(res.id, res);
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
      this.payrollStore.update(state => ({
        ...state, deleted: false
      }))
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.payrollStore.update(state => ({
            ...state, deleted: true
          }))
          this.payrollStore.remove(props.id);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, deleted: null
          }))
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
        map(res => this.mapToPayroll(res)),
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
      }));
      return this.service.scanHoliday(props.payrollId).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, scanned: true
          }));
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect()
  restore$ = this.action$.pipe(
    ofType(PayrollActions.restore),
    switchMap((props) => {
      return this.service.restore(props.id).pipe(
        tap(res => {
          this.message.success(res.message)
        }),
        catchError(err => {
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  private mapToPayroll(payroll: PayrollEntity): PayrollEntity {
    const basics = payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.BASIC || item.type === SalaryTypeEnum.BASIC_INSURANCE);
    const stays = payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.STAY);
    return Object.assign(payroll, {
      basics: basics,
      stays: stays,
      total: {
        payroll: payroll.total,
        basic: basics?.reduce((a, b) => a + (b?.price || 0), 0),
        stay: stays?.reduce((a, b) => a + (b?.price || 0), 0),
        allowance: this.getTotalAllowance(payroll.allowances),
        overtime: this.getTotalOvertimeOrAbsent(payroll.overtimes),
        absent: this.getTotalOvertimeOrAbsent(payroll.absents),
        deduction: payroll.deductions?.reduce((a, b) => a + (b?.price || 0), 0),
        holiday: this.getTotalHoliday(payroll.holidays),
        remote: this.getTotalRemoteOrDayOff(payroll.remotes),
        dayOff: this.getTotalRemoteOrDayOff(payroll.dayOffs)
      },
      overtimes: payroll.overtimes.map(overtime => Object.assign(overtime, {expand: false}))
    });
  }

  private getTotalAllowance(allowances: SalaryEntity[]): TotalSalary | undefined {
    return allowances?.reduce((a, b) => {
      return {
        price: a.price + (b.price || 0),
        total: a.total + b.total,
        duration: {
          day: a.duration.day + b.duration,
          hour: 0
        }
      };
    }, {price: 0, total: 0, duration: {day: 0, hour: 0}} as TotalSalary);
  }

  private getTotalOvertimeOrAbsent(salary: (AbsentSalaryEntity | OvertimeSalaryEntity)[]): TotalSalary {
    return salary.reduce((a, b) => {
      const unit = b.setting?.unit;
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
      };
    }, {price: 0, total: 0, duration: {day: 0, hour: 0}});
  }

  private getTotalRemoteOrDayOff(salary: RemoteSalaryEntity[] | DayOffSalaryEntity []) {
    return salary?.reduce((a, b) => {
      return {
        duration: a.duration + b.partial === PartialDayEnum.ALL_DAY ? b.duration : (b.duration / 2)
      };
    }, {duration: 0});
  }

  private getTotalHoliday(salary: HolidaySalaryEntity[]) {
    return salary?.reduce((a, b) => {
      return {
        duration: a.duration + (b.setting.startedAt && b.setting.endedAt
            ? moment(b.setting.endedAt).diff(b.setting.startedAt, 'days') + 1
            : 0
        )
      };
    }, {duration: 0});
  }
}
