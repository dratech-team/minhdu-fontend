import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {OrderHistory} from '../entities/order.entity';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate} from "@minhdu-fontend/data-models";

@Injectable()
export class OrderHistoryService extends BaseService<OrderHistory> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ORDER.ORDER_HISTORY, http);
  }

  pagination(params?: any): Observable<ResponsePaginate<OrderHistory>> {
    return super.pagination(params);
  }
}
