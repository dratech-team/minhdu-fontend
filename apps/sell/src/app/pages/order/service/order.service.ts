import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { CommodityUniq, Order } from '../+state/order.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<Order> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ORDER.ORDER, http);
  }

  addOne(props: Order): Observable<Order> {
    return super.addOne(props);
  }

  pagination(params?: any): Observable<ResponsePaginate<Order> & { commodityUniq: CommodityUniq[] }> {
    return super.pagination(params)
  }

  payment(id: number, body: any): Observable<Update<Order>> {
    return this.http.patch<Update<Order>>(Api.SELL.ORDER.ORDER + `/${id}/paid`, body);
  }

  getOne(id: any): Observable<Order> {
    return super.getOne(id);
  }

  update(id: any, body: any): Observable<UpdateNum<Order>> {
    return super.update(id, body);
  }

  updateHide(id: any, body: any): Observable<Update<Order>> {
    return this.http.patch<Update<Order>>('order/hide' + `/${id}`, body);
  }

  delete(id: number): Observable<void> {
    return super.delete(id);
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.delete<void>('order' + `/${id}` + '/cancel');
  }

  orderhistory(): Observable<any> {
    return this.http.get('');
  }
}
