import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { stakedChart } from '@minhdu-fontend/data-models';
import { Observable } from 'rxjs';

@Injectable({providedIn:'root'})
export class StatisticalProvinceService extends BaseService<stakedChart>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.SELL.STATISTICAL.STATISTICAL_PROVINCE, http)
  }
  getAll(param: any): Observable<stakedChart[]> {
    return super.getAll(param);
  }
}
