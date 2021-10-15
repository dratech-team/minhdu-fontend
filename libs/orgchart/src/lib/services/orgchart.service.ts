import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '@minhdu-fontend/constants';
import { Injectable } from '@angular/core';
import { Branch } from '@minhdu-fontend/data-models';
import { BaseService } from '@minhdu-fontend/service';

@Injectable()
export class OrgchartService extends BaseService<Branch> {
  constructor(
    public readonly http: HttpClient
  ) {
    super(Api.BRANCH, http);
  }

  getAll(params?: any): Observable<Branch[]> {
    return super.getAll(params);
  }
}
