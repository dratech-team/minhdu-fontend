import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {PayrollEntityState, PayrollStore} from './payroll.store';
import {Observable} from "rxjs";
import {PayrollEntity} from "../entities";
import {map} from "rxjs/operators";
import {SortSalaryUtil} from "../utils/sort-salary.util";

@Injectable({providedIn: 'root'})
export class PayrollQuery extends QueryEntity<PayrollEntityState> {
  constructor(protected store: PayrollStore) {
    super(store);
  }

  selectOneSort(id: PayrollEntity["id"]): Observable<PayrollEntity | undefined> {
    return super.selectEntity(id).pipe(map(payroll => {
      const clonePayroll = payroll ? JSON.parse(JSON.stringify(payroll)) : undefined
      if (clonePayroll && clonePayroll.sort?.overtime) {
        SortSalaryUtil(
          clonePayroll.sort.overtime.column,
          clonePayroll.sort.overtime.type,
          clonePayroll.overtimes
        )
      }
      return clonePayroll
    }));
  }
}
