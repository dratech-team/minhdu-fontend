import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { CommodityUniq, OrderEntity } from '../enitities/order.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { AddOrderDto } from '../dto/add-order.dto';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ORDER.ORDER, http);
  }

  addOne(props: AddOrderDto): Observable<OrderEntity> {
    return super.addOne(props);
  }

  pagination(params?: any): Observable<ResponsePaginate<OrderEntity> & { commodityUniq: CommodityUniq[] }> {
    return super.pagination(params)
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

  updateHide(id: any, body: any): Observable<OrderEntity> {
    return this.http.patch<OrderEntity>('order/hide' + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  cancelOrder(id: number): Observable<OrderEntity> {
    return this.http.delete<OrderEntity>('order' + `/${id}` + '/cancel');
  }

  orderhistory(): Observable<any> {
    return this.http.get('');
  }
}
