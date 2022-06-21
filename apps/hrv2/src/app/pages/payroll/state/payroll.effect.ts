import { NzMessageService } from 'ng-zorro-antd/message';
import { PayrollStore } from './payroll.store';
import { PayrollService } from '../services/payroll.service';
import { Actions, Effect, ofType } from '@datorama/akita-ng-effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PayrollActions } from './payroll.action';
import { AddPayrollDto } from '../dto';
import { Injectable } from '@angular/core';
import { AbsentSalaryEntity, OvertimeSalaryEntity, SalaryEntity } from '../../salary/entities';
import { PayrollEntity, TotalSalary } from '../entities';
import { DatetimeUnitEnum, SalaryTypeEnum } from '@minhdu-fontend/enums';
import { PartialDayEnum } from '@minhdu-fontend/data-models';
import { StateHistoryPlugin } from '@datorama/akita';
import { PayrollQuery } from './payroll.query';
import { PaginationDto } from '@minhdu-fontend/constants';
import { AddManyPayrollDto } from '../dto/add-many-payroll.dto';
import { HolidaySalaryEntity } from '../../salary/entities/holiday-salary.entity';
import * as moment from 'moment';
import { CompareSortUtil } from '../utils/compare-sort.util';
import { ConvertMinutePipe } from '../../../../../../../libs/components/src/lib/pipes/convert-minute.pipe';
import { getFirstDayInMonth, getLastDayInMonth } from '@minhdu-fontend/utils';

@Injectable({ providedIn: 'root' })
export class PayrollEffect {
  private stateHistory: StateHistoryPlugin;

  constructor(
    private readonly convertMinutePipe: ConvertMinutePipe,
    private readonly action$: Actions,
    private readonly service: PayrollService,
    private readonly message: NzMessageService,
    private readonly payrollStore: PayrollStore,
    private readonly payrollQuery: PayrollQuery
  ) {
    this.stateHistory = new StateHistoryPlugin(this.payrollQuery);
  }


  @Effect({ dispatch: false })
  addOne$ = this.action$.pipe(
    ofType(PayrollActions.addOne),
    switchMap((props: AddPayrollDto) => {
      this.payrollStore.update(state => ({
        ...state,
        loading: true
      }));
      return this.service.addOne(props).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state,
            loading: false
          }));
          this.message.success('Thêm phiếu lương thành công');
          this.payrollStore.add(res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: true })
  addMany$ = this.action$.pipe(
    ofType(PayrollActions.addMany),
    switchMap((props: AddManyPayrollDto) => {
      this.payrollStore.update(state => ({
        ...state,
        loading: true
      }));
      return this.service.addMany(props).pipe(
        map(res => {
          this.message.success(res.message);
          this.payrollStore.update(state => ({
            ...state,
            loading: false,
            search: {
              ...state.search,
              startedAt: getFirstDayInMonth(props.body.createdAt || new Date()),
              endedAt: getLastDayInMonth(props.body.createdAt || new Date())
            }
          }));
          return PayrollActions.loadAll({
            search: this.payrollQuery.getValue()?.search, isPaginate: false
          });
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, loading: false, error: true
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  loadAll$ = this.action$.pipe(
    ofType(PayrollActions.loadAll),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state,
        loading: true
      }));
      return this.service.paginationPayroll(Object.assign({}, props.search,
        {
          take: PaginationDto.take,
          skip: props.isPaginate ? this.payrollQuery.getCount() : PaginationDto.skip
        }
      )).pipe(
        map(res => {
          return Object.assign(res, {
            data: res.data.map(payroll => Object.assign({}, this.mapToPayroll(payroll), {
              expand: this.payrollStore.getValue().expandAll,
              basics: payroll.salariesv2
                ? payroll.salariesv2.filter(item => item.type !== SalaryTypeEnum.STAY)
                : [],
              stays: payroll.salariesv2
                ? payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.STAY)
                : []
            }))
          });
        }),
        tap((res) => {
          if (props.isPaginate) {
            this.payrollStore.upsertMany(res.data);
          } else {
            this.payrollStore.set(res.data);
          }

          this.payrollStore.update(state => ({
            ...state,
            total: res.total,
            totalSalary: res.total2,
            remain: res.total - this.payrollQuery.getCount(),
            loading: false
          }));
        }),
        catchError((err) => {
          this.payrollStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: false })
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

  @Effect({ dispatch: false })
  update$ = this.action$.pipe(
    ofType(PayrollActions.update),
    switchMap(props => {
      this.payrollStore.update(state => ({
        ...state, loading: true
      }));
      return this.service.update(props).pipe(
        map(res => this.mapToPayroll(res)),
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, loading: false
          }));
          this.message.success('Cập nhật phiếu lương thành công');
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state, loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  remove$ = this.action$.pipe(
    ofType(PayrollActions.remove),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state, loading: true
      }));
      return this.service.delete(props.id).pipe(
        tap(_ => {
          this.payrollStore.update(state => ({
            ...state,
            loading: false,
            total: state.total - 1
          }));
          this.payrollStore.remove(props.id);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  confirmPayroll$ = this.action$.pipe(
    ofType(PayrollActions.confirmPayroll),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state,
        loading: true
      }));
      return this.service.confirm(props).pipe(
        map(res => this.mapToPayroll(res)),
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, loading: false
          }));
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  /**
   * @deprecated
   * thay đổi logic ngày lễ ko còn quét
   * */
  @Effect({ dispatch: false })
  scanHoliday$ = this.action$.pipe(
    ofType(PayrollActions.scanHoliday),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state,
        loading: true,
        error: false
      }));
      return this.service.scanHoliday(props.payrollId).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state, loading: false
          }));
          this.payrollStore.update(res.id, res);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  @Effect({ dispatch: false })
  restore$ = this.action$.pipe(
    ofType(PayrollActions.restore),
    switchMap((props) => {
      this.payrollStore.update(state => ({
        ...state,
        loading: true
      }));
      return this.service.restore(props.id).pipe(
        tap(res => {
          this.payrollStore.update(state => ({
            ...state,
            loading: false
          }));
          this.message.success(res.message);
        }),
        catchError(err => {
          this.payrollStore.update(state => ({
            ...state,
            loading: undefined
          }));
          return of(PayrollActions.error(err));
        })
      );
    })
  );

  private mapToPayroll(payroll: PayrollEntity): PayrollEntity {
    const basics = payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.BASIC || item.type === SalaryTypeEnum.BASIC_INSURANCE);
    const stays = payroll.salariesv2.filter(item => item.type === SalaryTypeEnum.STAY);
    const overtimes = this.payrollQuery.getEntity(payroll.id)?.overtimes;

    return Object.assign(payroll, {
      basics: basics,
      stays: stays,
      allowances: this.sortDatetime(payroll.allowances),
      absents: this.sortDatetime(payroll.absents),
      dayoffs: this.sortDatetime(payroll.dayoffs),
      overtimes: this.sortDatetime(payroll.overtimes)?.map(overtime => Object.assign(overtime, { expand: false })),
      holidays: payroll.holidays?.sort((a, b) => {
          return CompareSortUtil(a.setting.startedAt, b.setting.startedAt, true);
        }
      ).map(holiday => Object.assign(holiday, { expand: false })),
      remotes: this.sortDatetime(payroll.remotes),
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
        dayOff: this.getTotalRemoteOrDayOff(payroll.dayoffs)
      }
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
    }, { price: 0, total: 0, duration: { day: 0, hour: 0 } } as TotalSalary);
  }

  private getTotalOvertimeOrAbsent(salary: (AbsentSalaryEntity | OvertimeSalaryEntity)[]): TotalSalary {
    return salary.reduce((a, b) => {
      const unit = b.setting?.unit;
      const partial = (
        unit === DatetimeUnitEnum.DAY || unit === DatetimeUnitEnum.MONTH || unit === DatetimeUnitEnum.TIMES
          ? (b.partial === PartialDayEnum.ALL_DAY || b.partial === PartialDayEnum.NIGHT ? b.duration : (b.duration / 2))
          : 0
      );
      const day = a.duration.day + partial;
      const hour = a.duration.hour + this.convertMinutePipe.transform(a.duration.minute).hour +
        (unit === DatetimeUnitEnum.HOUR ? this.convertMinutePipe.transform(b.duration * 60).hour : 0);
      const minute = this.convertMinutePipe.transform(a.duration.minute).minute +
        (
          unit === DatetimeUnitEnum.MINUTE ? b.duration : unit === DatetimeUnitEnum.HOUR
            ? this.convertMinutePipe.transform(b.duration * 60).minute
            : 0
        );
      return {
        price: a.price + (b.price || 0),
        total: a.total + b.total,
        duration: {
          day: day,
          hour: hour,
          minute: minute
        }
      };
    }, { price: 0, total: 0, duration: { day: 0, hour: 0, minute: 0 } });
  }

  private getTotalRemoteOrDayOff(salary: SalaryEntity []) {
    return salary?.reduce((a, b) => {
      return {
        duration: a.duration + ((b.partial && b.partial === PartialDayEnum.ALL_DAY) ? b.duration : (b.duration / 2))
      };
    }, { duration: 0 });
  }

  private getTotalHoliday(salary: HolidaySalaryEntity[]) {
    return salary?.reduce((a, b) => {
      return {
        duration: a.duration + (b.setting.startedAt && b.setting.endedAt
            ? moment(b.setting.endedAt).diff(b.setting.startedAt, 'days') + 1
            : 0
        ),
        total: a.total + b.total
      };
    }, { duration: 0, total: 0 });
  }

  private sortDatetime(salaries?: SalaryEntity[]) {
    if (salaries) {
      return salaries.sort((a, b) => {
        return CompareSortUtil(a.startedAt, b.startedAt, true);
      });
    } else {
      return [];
    }

  }
}
