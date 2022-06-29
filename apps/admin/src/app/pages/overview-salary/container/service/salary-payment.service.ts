import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { OverviewSalary } from '../model/overview-salary';

@Injectable({ providedIn: 'root' })
export class SalaryPaymentService {
  constructor(public readonly http: HttpClient) {}

  getAll(params?: any): Observable<any> {
    return this.http.get<any>(Api.ADMIN.HR, { params });
  }

  getOne(id: number, year: number): Observable<any> {
    return this.http.get<any>(Api.ADMIN.HR + `/${id}`, { params: { year } });
  }
}
