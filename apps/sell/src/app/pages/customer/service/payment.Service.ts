import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';
import { Payment } from '../+state/payment/payment.interface';

@Injectable({providedIn: 'root'})
export class PaymentService extends BaseService<Payment> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.PAYMENT, http);
  }

  pagination(params: any): Observable<ResponsePaginate<Payment>> {
    return super.pagination(params);
  }

  payment(id: any, body: any): Observable<Update<any>> {
    return this.http.patch<Update<any>>(Api.CUSTOMER + `/${id}/payment`, body);
  }

}
