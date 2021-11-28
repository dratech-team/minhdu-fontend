import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { PaymentHistory, ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';


@Injectable({providedIn: 'root'})
export class PaymentService extends BaseService<PaymentHistory> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.CUSTOMER.PAYMENT, http);
  }

  pagination(params: any): Observable<ResponsePaginate<PaymentHistory>> {
    return super.pagination(params);
  }

  update(id: any, body: any): Observable<UpdateNum<PaymentHistory>> {
    return super.update(id, body);
  }

  payment(body: any): Observable<PaymentHistory> {
    return this.http.post<PaymentHistory>(Api.SELL.CUSTOMER.PAYMENT, body);
  }

}
