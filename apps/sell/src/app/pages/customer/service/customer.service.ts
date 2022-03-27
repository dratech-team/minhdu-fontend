import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { CustomerEntity } from '../entities/customer.entity';
import { AddCustomerDto } from '../dto/add-customer.dto';
import { LoadCustomerDto } from '../dto/load-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

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

  pagination(params: LoadCustomerDto): Observable<ResponsePaginate<CustomerEntity>> {
    return super.pagination(params);
  }

  getOne(id: CustomerEntity['id']): Observable<CustomerEntity> {
    return super.getOne(id);
  }

  update(id: CustomerEntity['id'], body: UpdateCustomerDto): Observable<CustomerEntity> {
    return super.update(id, body);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
