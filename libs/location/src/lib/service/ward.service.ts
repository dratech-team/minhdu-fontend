import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Ward } from '@minhdu-fontend/data-models';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WardService extends BaseService<Ward> {
  constructor(public readonly http: HttpClient) {
    super(Api.LOCATION.WARD, http);
  }

  getAll(params?: any): Observable<Ward[]> {
    return super.getAll(params);
  }

  getOne(id: any): Observable<Ward> {
    return super.getOne(id);
  }
}
