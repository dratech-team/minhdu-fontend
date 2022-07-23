import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { AddOrderDto, BaseSearchOrderDto, UpdateOrderDto } from '../dto';
import { BaseOrderEntity, OrderEntity } from '../enitities';
import { ResponsePaginateOrderEntity } from '../enitities/response-paginate-order.entity';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<BaseOrderEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.ORDER.ORDER, http);
  }

  addOne(props: AddOrderDto): Observable<BaseOrderEntity> {
    return super.addOne(props.body);
  }

  pagination(
    params?: BaseSearchOrderDto
  ): Observable<ResponsePaginateOrderEntity> {
    return super.pagination(params);
  }

  payment(id: number, body: any): Observable<Update<BaseOrderEntity>> {
    return this.http.patch<Update<BaseOrderEntity>>(this.url + `/${id}/paid`, body);
  }

  getOne(id: BaseOrderEntity['id']): Observable<BaseOrderEntity> {
    return super.getOne(id);
  }

  update(updateDto: UpdateOrderDto): Observable<BaseOrderEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  hide(id: any, body: any): Observable<BaseOrderEntity> {
    return this.http.patch<BaseOrderEntity>(this.url + '/hide' + `/${id}`, body);
  }

  delete(id: BaseOrderEntity['id']): Observable<void> {
    return super.delete(id);
  }

  cancel(id: BaseOrderEntity['id'], body: {reason?: string}): Observable<BaseOrderEntity> {
    return this.http.delete<OrderEntity>(this.url + `/${id}` + '/cancel', { body });
  }

  restore(id: BaseOrderEntity['id']): Observable<BaseOrderEntity> {
    return this.http.patch<BaseOrderEntity>(this.url + `/${id}` + '/restore', null);
  }

  orderHistory(): Observable<any> {
    return this.http.get('');
  }
}
