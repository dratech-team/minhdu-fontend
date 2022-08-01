import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginateOvertimePayrollV1 } from '@minhdu-fontend/data-models';
import { BaseService } from 'libs/service/base.service';
import { Observable } from 'rxjs';
import { Payroll } from '../+state/payroll/payroll.interface';
import { VersionEnum } from '@minhdu-fontend/enums';

type Params =
  | HttpParams
  | {
      [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
    };

@Injectable({ providedIn: 'root' })
export class PayrollService extends BaseService<Payroll> {
  constructor(public readonly http: HttpClient) {
    super(Api.HR.PAYROLL.PAYROLL, http);
  }

  addPayroll<R>(body: any, params?: Params): Observable<any> {
    return this.http.post<any>(this.url, body, { params: params });
  }

  getOne(id: any): Observable<Payroll> {
    return super.getOne(id);
  }

  paginationPayroll(
    params?: any
  ): Observable<ResponsePaginateOvertimePayrollV1<Payroll>> {
    return this.http.get<ResponsePaginateOvertimePayrollV1<Payroll>>(
      VersionEnum.V1 + Api.HR.PAYROLL.PAYROLL,
      { params }
    );
  }

  update(id: any, body: any): Observable<Payroll> {
    return super.update(id, body);
  }

  confirmPayroll(id: number, body?: any): Observable<Payroll> {
    return this.http.patch<Payroll>(
      VersionEnum.V1 + Api.HR.PAYROLL.CONFIRM_PAYROLL + `/${id}`,
      body
    );
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  generate(params?: any): Observable<any> {
    return this.http.get<any>(VersionEnum.V1 + Api.HR.PAYROLL.GENERATE, {
      params,
    });
  }

  scanHoliday(PayrollId: number): Observable<any> {
    return this.http.get<any>(
      this.url + `/${PayrollId}/` + Api.HR.PAYROLL.GENERATE_HOLIDAY
    );
  }

  restorePayroll(id: number, body?: any): Observable<any> {
    return this.http.patch<any>(
      VersionEnum.V1 + Api.HR.PAYROLL.RESTORE_PAYROLL + `/${id}`,
      body
    );
  }

  getAllTempLate(params?: any): Observable<string[]> {
    return this.http.get<string[]>(
      VersionEnum.V1 + Api.HR.PAYROLL.TEMPLATE_SALARY,
      { params }
    );
  }

  cancelConfirmPayroll(id: number, body?: any): Observable<any> {
    return this.http.patch<any>(
      VersionEnum.V1 + Api.HR.PAYROLL.CANCEL_CONFIRM + `/${id}`,
      body
    );
  }
}
