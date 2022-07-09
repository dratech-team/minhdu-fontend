import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { AddOrderDto, BaseSearchOrderDto, UpdateOrderDto } from '../dto';
import { CommodityUniq } from '../../commodity/entities';
import { OrderEntity } from '../enitities/order.entity';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<OrderEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.ORDER.ORDER, http);
  }

  addOne(props: AddOrderDto): Observable<OrderEntity> {
    return super.addOne(props.body);
  }

  pagination(
    params?: BaseSearchOrderDto
  ): Observable<
    ResponsePaginate<OrderEntity> & { commodityUniq: CommodityUniq[] }
  > {
    return super.pagination(params);
  }

  payment(id: number, body: any): Observable<Update<OrderEntity>> {
    return this.http.patch<Update<OrderEntity>>(this.url + `/${id}/paid`, body);
  }

  getOne(id: OrderEntity['id']): Observable<OrderEntity> {
    return super.getOne(id);
  }

  update(updateDto: UpdateOrderDto): Observable<OrderEntity> {
    return super.update(updateDto.id, updateDto.updates);
  }

  updateHide(id: any, body: any): Observable<OrderEntity> {
    return this.http.patch<OrderEntity>(this.url + '/hide' + `/${id}`, body);
  }

  delete(id: OrderEntity['id']): Observable<void> {
    return super.delete(id);
  }

  cancelOrder(id: OrderEntity['id']): Observable<OrderEntity> {
    return this.http.delete<OrderEntity>(this.url + `/${id}` + '/cancel');
  }

  orderhistory(): Observable<any> {
    return this.http.get('');
  }
}
