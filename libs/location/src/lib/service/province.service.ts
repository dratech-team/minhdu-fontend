import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import {  Province } from '@minhdu-fontend/data-models';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable()
export class ProvinceService extends BaseService<Province> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.LOCATION.PROVINCE, http);
  }

  getAll(): Observable<Province[]> {
    return super.getAll();
  }

  getOne(id: any): Observable<Province> {
    return super.getOne(id);
  }
}
