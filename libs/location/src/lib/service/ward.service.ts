import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { Ward } from '@minhdu-fontend/data-models';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable()
export class WardService extends BaseService<Ward> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.WARD, http);
  }

  getAll(): Observable<Ward[]> {
    return super.getAll();
  }

  getOne(id: any): Observable<Ward> {
    return super.getOne(id);
  }
}
