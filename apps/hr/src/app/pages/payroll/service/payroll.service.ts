import { Injectable } from '@angular/core';
import { BaseService } from '../../../service/base.service';
import { Payroll } from '../+state/payroll.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';

@Injectable({providedIn:'root'})
export class PayrollService extends BaseService<Payroll>{
  constructor(
    public readonly http: HttpClient,
  ) {
    super(Api.PAYROLL , http );
  }

  addOne(payroll: Payroll): Observable<Payroll> {
    return super.addOne(payroll);
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

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
