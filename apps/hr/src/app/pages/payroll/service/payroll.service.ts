import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity';
import { BaseService } from 'libs/service/base.service';
import { Observable } from 'rxjs';
import { Payroll } from '../+state/payroll/payroll.interface';
import { UpdateNum } from '@ngrx/entity/src/models';

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
    super(Api.PAYROLL, http);
  }

  addPayroll<R>(body: any, params?: Params): Observable<any> {
    return this.http.post<any>(this.url, body, { params: params });
  }

  getOne(id: any): Observable<Payroll> {
    return super.getOne(id);
  }

  pagination(params?: any): Observable<ResponsePaginate<Payroll>> {
    return super.pagination(params);
  }

  update(id: any, body: any): Observable<UpdateNum<Payroll>> {
    return super.update(id, body);
  }

  confirmPayroll(id: number, body?: any): Observable<Payroll> {
    return this.http.patch<Payroll>(Api.CONFIRM_PAYROLL + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  generate(params?: any): Observable<any> {
    return this.http.get<any>(Api.GENERATE, { params });
  }

  scanHoliday(PayrollId: number): Observable<any> {
    return this.http.get<any>(
      Api.PAYROLL + `/${PayrollId}/` + Api.GENERATE_HOLIDAY
    );
  }

  restorePayroll(id: number, body?: any): Observable<any> {
    return this.http.patch<any>(Api.RESTORE_PAYROLL + `/${id}`, body);
  }
}
