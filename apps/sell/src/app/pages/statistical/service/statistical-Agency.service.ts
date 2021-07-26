import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';

import { Observable } from 'rxjs';
import { Statistical } from '@minhdu-fontend/data-models';

@Injectable({providedIn:'root'})
export class StatisticalAgencyService extends BaseService<Statistical>{
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.STATISTICAL_AGENCY, http)
  }
  getAll(param: any): Observable<Statistical[]> {
    return super.getAll();
  }
}
