import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {BaseService} from 'libs/service/base.service';
import {PayrollSalary} from '../../../../../../../libs/data-models/hr/salary/payroll-salary';
import {VersionEnum} from "@minhdu-fontend/enums";

@Injectable({providedIn: 'root'})
export class OvertimeService extends BaseService<PayrollSalary> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.OVERTIME, http);
  }

  getOvertime(params?: any): Observable<PayrollSalary> {
    return this.http.get<PayrollSalary>(VersionEnum.V1 + Api.HR.PAYROLL.OVERTIME, {params});
  }
}
