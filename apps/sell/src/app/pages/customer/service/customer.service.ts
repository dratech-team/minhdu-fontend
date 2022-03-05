import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { UpdateNum } from '@ngrx/entity/src/models';
import { CustomerEntity } from '../entities/customer.interface';
import { AddCustomerDto } from '../dto/add-customer.dto';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.CUSTOMER.CUSTOMER, http);
  }

  addOne(props: AddCustomerDto): Observable<CustomerEntity> {
    return super.addOne(props);
  }

  pagination(params: any): Observable<ResponsePaginate<CustomerEntity>> {
    return super.pagination(params);
  }

  getOne(id: any): Observable<CustomerEntity> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<UpdateNum<CustomerEntity>> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
