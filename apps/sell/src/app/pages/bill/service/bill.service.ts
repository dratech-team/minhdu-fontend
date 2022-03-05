import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { Bill } from '../entities/bill.entity';

@Injectable({providedIn:'root'})
export class BillService extends BaseService<Bill>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.BILL , http);
  }
  pagination(params: any): Observable<ResponsePaginate<Bill>> {
    return super.pagination(params);
  }
}
