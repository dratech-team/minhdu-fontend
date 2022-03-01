import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { OrderEntity } from '../entities/order.entity';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { CreateOrderDto } from '../dto/create-order.dto';
import { SearchOrderDto } from '../dto/search-order.dto';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ORDER.ORDER, http);
  }

  addOne(props: CreateOrderDto): Observable<OrderEntity> {
    return super.addOne(props);
  }

  pagination(params?: Partial<SearchOrderDto>): Observable<ResponsePaginate<OrderEntity>> {
    return super.pagination(params);
  }

  payment(id: number, body: any): Observable<Update<OrderEntity>> {
    return this.http.patch<Update<OrderEntity>>(Api.SELL.ORDER.ORDER + `/${id}/paid`, body);
  }

  getOne(id: any): Observable<OrderEntity> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<UpdateNum<OrderEntity>> {
    return super.update(id, body);
  }

  updateHide(id: any, body: any): Observable<Update<OrderEntity>> {
    return this.http.patch<Update<OrderEntity>>('order/hide' + `/${id}`, body);
  }

  delete(id: number): Observable<OrderEntity> {
    return super.delete(id);
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.delete<void>('order' + `/${id}` + '/cancel');
  }

  orderhistory(): Observable<any> {
    return this.http.get('');
  }
}
