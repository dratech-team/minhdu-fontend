import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Bill } from '../+state/Bill.interface';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';
import { ResponsePaginate } from '@minhdu-fontend/data-models';

@Injectable({providedIn:'root'})
export class BillService extends BaseService<Bill>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.BILL , http);
  }
  pagination(params: any): Observable<ResponsePaginate<Bill>> {
    return super.pagination(params);
  }
}
