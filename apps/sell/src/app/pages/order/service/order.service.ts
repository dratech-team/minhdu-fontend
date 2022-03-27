import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { OrderEntity } from '../enitities/order.entity';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { UpdateNum } from '@ngrx/entity/src/models';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { AddOrderDto } from '../dto/add-order.dto';
import { CommodityUniq } from '../../commodity/entities/commodities/commodity-uniq.entity';
import { LoadOrderDto } from '../dto/load-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

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

  pagination(params?: LoadOrderDto): Observable<ResponsePaginate<OrderEntity> & { commodityUniq: CommodityUniq[] }> {
    return super.pagination(params);
  }

  payment(id: number, body: any): Observable<Update<OrderEntity>> {
    return this.http.patch<Update<OrderEntity>>(Api.SELL.ORDER.ORDER + `/${id}/paid`, body);
  }

  getOne(id: OrderEntity['id']): Observable<OrderEntity> {
    return super.getOne(id);
  }

  update(id: OrderEntity['id'], body: UpdateOrderDto): Observable<OrderEntity> {
    return super.update(id, body);
  }

  updateHide(id: any, body: any): Observable<OrderEntity> {
    return this.http.patch<OrderEntity>('order/hide' + `/${id}`, body);
  }

  delete(id: OrderEntity['id']): Observable<void> {
    return super.delete(id);
  }

  cancelOrder(id: OrderEntity['id']): Observable<OrderEntity> {
    return this.http.delete<OrderEntity>('order' + `/${id}` + '/cancel');
  }

  orderhistory(): Observable<any> {
    return this.http.get('');
  }
}
