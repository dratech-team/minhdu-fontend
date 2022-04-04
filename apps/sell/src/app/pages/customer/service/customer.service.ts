import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { CustomerEntity } from '../entities/customer.entity';
import { AddCustomerDto } from '../dto/add-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import {SearchCustomerDto} from "../dto/search-customer.dto";

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.CUSTOMER.CUSTOMER, http);
  }

  addOne(props: AddCustomerDto): Observable<CustomerEntity> {
    return super.addOne(props.body);
  }

  pagination(params: SearchCustomerDto): Observable<ResponsePaginate<CustomerEntity>> {
    return super.pagination(params);
  }

  getOne(id: CustomerEntity['id']): Observable<CustomerEntity> {
    return super.getOne(id);
  }

  update(updateDto:UpdateCustomerDto): Observable<CustomerEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }


  delete(id: number): Observable<void> {
    return super.delete(id);
  }
}
