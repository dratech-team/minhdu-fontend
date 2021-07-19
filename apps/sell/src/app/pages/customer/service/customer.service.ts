import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Customer } from '../+state/customer.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Update } from '@ngrx/entity/src/models';

@Injectable({providedIn: 'root'})
export class CustomerService extends BaseService<Customer> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.CUSTOMER, http);
  }

  addOne(props: Customer): Observable<Customer> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<Customer>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<Customer> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<Update<Customer>> {
    return super.update(id, body);
  }
  payment(id: any, body: any): Observable<Update<any>> {
    return this.http.patch<Update<any>>(Api.CUSTOMER + `/${id}/payment`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
