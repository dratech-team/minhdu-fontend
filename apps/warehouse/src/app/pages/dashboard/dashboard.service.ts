import { Injectable } from '@angular/core';
import { BaseService } from '@minhdu-fontend/service';
import { HttpClient } from '@angular/common/http';
import { Api } from '@minhdu-fontend/constants';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService extends BaseService<{ id: number, name: string }> {
  constructor(public http: HttpClient) {
    super(Api.WAREHOUSE.WAREHOUSE, http);
  }

  getAll(params?: any): Observable<{ id: number; name: string }[]> {
    return super.getAll(params);
  }
}
