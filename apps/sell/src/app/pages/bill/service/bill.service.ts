import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';
import { BillEntity } from '../entities';

@Injectable({ providedIn: 'root' })
export class BillService extends BaseService<BillEntity> {
  constructor(public readonly http: HttpClient) {
    super(Api.SELL.BILL, http);
  }

  pagination(params: any): Observable<ResponsePaginate<BillEntity>> {
    return super.pagination(params);
  }
}
