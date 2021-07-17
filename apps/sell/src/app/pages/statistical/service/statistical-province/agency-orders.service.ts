import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { ProvinceOrder } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class AgencyRevenueService extends BaseService<ProvinceOrder>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.STATISTICAL_ORDERS, http)
  }
  getAll(): Observable<ProvinceOrder[]> {
    return super.getAll();
  }
}
