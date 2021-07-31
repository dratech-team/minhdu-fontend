import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { PaymentHistory, ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';


@Injectable({providedIn: 'root'})
export class PaymentService extends BaseService<PaymentHistory> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.PAYMENT, http);
  }

  pagination(params: any): Observable<ResponsePaginate<PaymentHistory>> {
    return super.pagination(params);
  }

  payment(id: any, body: any): Observable<any> {
    return this.http.patch<Update<any>>(Api.CUSTOMER + `/${id}/payment`, body);
  }

}
