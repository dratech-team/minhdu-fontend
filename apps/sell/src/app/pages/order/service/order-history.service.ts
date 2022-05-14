import {Injectable} from '@angular/core';
import {BaseService} from '@minhdu-fontend/service';
import {HttpClient} from '@angular/common/http';
import {Api} from '@minhdu-fontend/constants';
import {Observable} from 'rxjs';
import {ResponsePaginate} from "@minhdu-fontend/data-models";
import { OrderHistoryEntity } from '../enitities';

@Injectable({providedIn: 'root'})
export class OrderHistoryService extends BaseService<OrderHistoryEntity> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.ORDER.ORDER_HISTORY, http);
  }

  pagination(params?: any): Observable<ResponsePaginate<OrderHistoryEntity>> {
    return super.pagination(params);
  }
}
