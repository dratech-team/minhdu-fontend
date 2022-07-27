import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { BaseSearchCustomerDto, CustomerEntity } from '../entities';
import { AddCustomerDto, UpdateCustomerDto } from '../dto';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.CUSTOMER.CUSTOMER, http);
  }

  addOne(props: AddCustomerDto): Observable<CustomerEntity> {
    return super.addOne(props.body);
  }

  pagination(
    params: Partial<BaseSearchCustomerDto>
  ): Observable<ResponsePaginate<CustomerEntity>> {
    return super.pagination(params);
  }

  getOne(id: CustomerEntity['id']): Observable<CustomerEntity> {
    return super.getOne(id);
  }

  update(updateDto: UpdateCustomerDto): Observable<CustomerEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  syncDebt(id: number): Observable<CustomerEntity> {
    return this.http.get<CustomerEntity>(VersionEnum.V1 + Api.SELL.CUSTOMER.CUSTOMER + `/${id}/payment/sync`);
  }
}
