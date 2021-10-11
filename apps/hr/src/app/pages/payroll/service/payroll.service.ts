import { Injectable } from '@angular/core';
import { Payroll } from '../+state/payroll/payroll.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { BaseService } from 'libs/service/base.service';

@Injectable({ providedIn: 'root' })
export class PayrollService extends BaseService<Payroll> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.PAYROLL, http);
  }


  addPayroll(body: any): Observable<any> {
    return this.http.post<any>(this.url, body);
  }

  getOne(id: any): Observable<Payroll> {
    return super.getOne(id);
  }

  pagination(params: any): Observable<ResponsePaginate<Payroll>> {
    return super.pagination(params);
  }

  update(id: any, body: any): Observable<Update<Payroll>> {
    return super.update(id, body);
  }

  confirmPayroll(id: number, body?: any): Observable<any> {
    return this.http.patch<any>(Api.CONFIRM_PAYROLL + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  generate(params?: any): Observable<any> {
    return this.http.get<any>(Api.GENERATE, { params });
  }

  scanHoliday(PayrollId: number):Observable<any>{
    return this.http.get<any>(Api.PAYROLL + `/${PayrollId}/` + Api.GENERATE_HOLIDAY);
  }
}
