import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { AddOrderDto, BaseUpdateOrderDto, SearchOrderDto } from '../dto';
import { BaseOrderEntity, OrderEntity } from '../enitities';
import { ResponsePaginateOrderEntity } from '../enitities/response-paginate-order.entity';
import { CustomerEntity } from '../../customer/entities';
import { VersionEnum } from '@minhdu-fontend/enums';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<BaseOrderEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.ORDER.ORDER, http);
  }

  addOne(props: AddOrderDto): Observable<BaseOrderEntity> {
    return super.addOne(props.body);
  }

  pagination(params?: SearchOrderDto): Observable<ResponsePaginateOrderEntity> {
    return super.pagination(params?.search);
  }

  payment(id: number, body: any): Observable<Update<BaseOrderEntity>> {
    return this.http.patch<Update<BaseOrderEntity>>(this.url + `/${id}/paid`, body);
  }

  getOne(id: BaseOrderEntity['id']): Observable<BaseOrderEntity> {
    return super.getOne(id);
  }

  update(id: number, updates: Partial<BaseUpdateOrderDto>): Observable<BaseOrderEntity> {
    return super.update(id, updates);
  }

  hide(id: any, body: any): Observable<BaseOrderEntity> {
    return this.http.patch<BaseOrderEntity>(this.url + '/hide' + `/${id}`, body);
  }

  delete(id: BaseOrderEntity['id']): Observable<void> {
    return super.delete(id);
  }

  cancel(id: BaseOrderEntity['id'], body: { reason?: string | null | undefined }): Observable<BaseOrderEntity> {
    return this.http.delete<OrderEntity>(this.url + `/${id}` + '/cancel', { body });
  }

  restore(id: BaseOrderEntity['id']): Observable<BaseOrderEntity> {
    return this.http.patch<BaseOrderEntity>(this.url + `/${id}` + '/restore', null);
  }

  syncPriceTotal(id: number): Observable<BaseOrderEntity> {
    return this.http.get<BaseOrderEntity>(VersionEnum.V1 + Api.SELL.ORDER.ORDER + `/${id}/price-total/sync`);
  }
}
