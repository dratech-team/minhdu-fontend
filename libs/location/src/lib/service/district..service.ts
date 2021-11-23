import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { District } from '@minhdu-fontend/data-models';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable()
export class DistrictService extends BaseService<District> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.LOCATION.DISTRICT, http);
  }

  getAll(params?: any): Observable<District[]> {
    return super.getAll(params);
  }

  getOne(id: any): Observable<District> {
    return super.getOne(id);
  }
}
