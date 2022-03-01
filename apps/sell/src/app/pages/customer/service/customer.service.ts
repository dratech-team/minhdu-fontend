import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Customer } from '../+state/customer.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService<Customer> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.CUSTOMER.CUSTOMER, http);
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

  update(id: any, body: any): Observable<UpdateNum<Customer>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<Customer> {
    return super.delete(id);
  }
}
