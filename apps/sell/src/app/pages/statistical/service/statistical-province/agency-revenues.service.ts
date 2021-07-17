import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { ProvinceRevenue } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class AgencyRevenuesService extends BaseService<ProvinceRevenue>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.STATISTICAL_REVENUE, http)
  }
  getAll(): Observable<ProvinceRevenue[]> {
    return super.getAll();
  }
}
