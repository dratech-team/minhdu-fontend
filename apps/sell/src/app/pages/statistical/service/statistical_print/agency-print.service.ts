import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';

import { Observable } from 'rxjs';
import { stakedChart } from '@minhdu-fontend/data-models';

@Injectable({providedIn:'root'})
export class AgencyPrintService extends BaseService<stakedChart>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.STATISTICAL_AGENCY_PRINT, http)
  }
  getAll(param: any): Observable<stakedChart[]> {
    return super.getAll(param);
  }
}
